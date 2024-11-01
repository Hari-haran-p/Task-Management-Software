const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const db = require("./Database/db.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  try {
    const results = await db.query(query, [email, password]); // Assuming db.query is asynchronous and returns a promise
    if (results.length > 0) {
      const user = results[0];

      res.json({ id: user.id, email: user.email, level: user.level });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.get("/api/getTaskData", async (req, res) => {
  const userEmail = req.query.userEmail;
  // console.log(userEmail);

  const query = "SELECT * FROM task_details_view WHERE assigned_to = ?";

  try {
    const results = await db.query(query, [userEmail]);
    if (results.length > 0) {
      res.json({ results});
    } else {
      res.json({ message: "No tasks found for this user" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.get("/api/getAssignedData", async (req, res) => {
  const userId = req.query.userId;

  const query = "SELECT * FROM tasks WHERE assigned_by = ?";

  try {
    const results = await db.query(query, [userId]);
    res.json({ results });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.post("/api/deleteTask", async (req, res) => {
  const taskId = req.body.taskId;
  const deleteTaskQuery = "DELETE FROM tasks WHERE id = ?";
  const deleteTaskAssigneesQuery = "DELETE FROM task_assignee WHERE task_id = ?";
  
  let connection;

  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    await connection.beginTransaction(); // Start a transaction

    // Delete task assignees first
    const deleteAssigneesResult = await new Promise((resolve, reject) => {
      connection.query(deleteTaskAssigneesQuery, [taskId], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
    console.log("Deleted task assignees:", deleteAssigneesResult.affectedRows);

    // Delete the task itself
    const deleteTaskResult = await new Promise((resolve, reject) => {
      connection.query(deleteTaskQuery, [taskId], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

    // Check if any task was deleted
    if (deleteTaskResult.affectedRows > 0) {
      await connection.commit(); // Commit the transaction
      res.json({ message: "Task deleted successfully", success: 1 });
    } else {
      await connection.rollback(); // Rollback if task wasn't found
      res.status(404).json({ message: "Task not found", success: 0 });
    }
  } catch (err) {
    if (connection) await connection.rollback(); // Rollback transaction on error
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
});

app.post("/api/getAssignedUsers", async (req, res) => {
  const taskId = req.body.taskId;
  const query = "SELECT * FROM assignees_detail_view WHERE task_id = ?";

  try {
    const results = await db.query(query, [taskId]);
    res.json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.get("/api/getUserByLevel", async (req, res) => {
  const level = req.query.level;

  const query = "SELECT * FROM users WHERE level = ?";

  try {
    const results = await db.query(query, [level - 1]); // Ensure level logic is correct
    if (results.length > 0) {
      res.json({ results });
      // console.log(results);
    } else {
      res.status(401).json({ message: "No level found for this user" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.post("/api/addNewTask", async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start a transaction

    const {
      task_name,
      priority,
      due_date,
      status_id,
      assigned_by,
      task_desc,
      selectedUsers,
    } = req.body;

    // console.log("Starting transaction...");
    // console.log("Task Details:", { task_name, priority, due_date, status_id, assigned_by, task_desc });
    // console.log("Selected Users:", selectedUsers); // Log for debugging

    const taskQuery =
      "INSERT INTO tasks (title, priority, due_date, column_id, assigned_by, task_desc) VALUES(?,?,?,?,?,?)";
    const userTaskQuery =
      "INSERT INTO task_assignee (task_id, user_id) VALUES ?";

    // Insert the task
    const taskResult = await new Promise((resolve, reject) => {
      connection.query(
        taskQuery,
        [task_name, priority, due_date, status_id, assigned_by, task_desc],
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    const task_id = taskResult.insertId; // Get inserted task's ID
    // console.log("Task inserted with ID:", task_id);

    // Prepare bulk insert for task_assignee
    if (selectedUsers.length > 0) {
      const values = selectedUsers.map((user_id) => [task_id, user_id]);
      // console.log("Values to insert into task_assignee:", values);

      // Insert into task_assignee
      const userTaskResult = await new Promise((resolve, reject) => {
        connection.query(userTaskQuery, [values], (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });

      if (userTaskResult.affectedRows === values.length) {
        // console.log("All task assignees inserted successfully");
      } else {
        throw new Error("Not all task assignees were inserted");
      }
    } else {
      console.warn("No users were selected for this task");
    }

    // Commit transaction if everything succeeded
    await connection.commit();
    // console.log("Transaction committed successfully");

    // Send success response
    res.json({
      message: "Task Added Successfully",
      task_id: task_id,
      assignedUsers: selectedUsers,
    });
  } catch (err) {
    // Rollback transaction on error
    if (connection) await connection.rollback();
    console.error("Transaction failed and rolled back:", err);
    res.status(500).json({
      message: "Database error during task or assignee insertion",
      error: err.message,
    });
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
});

app.post("/api/updateTask", async (req, res) => {
  const {
    task_id,
    task_name,
    priority,
    due_date,
    status_id,
    assigned_by,
    task_desc,
    selectedUsers,
  } = req.body;

  const userIds = selectedUsers;

  console.log(
    task_desc,
    task_name,
    task_id,
    priority,
    due_date,
    status_id,
    assigned_by
  );
  console.log(userIds);

  if (!Array.isArray(userIds)) {
    return res.status(400).json({ message: "Invalid selectedUsers format" });
  }

  const updateTaskQuery =
    "UPDATE tasks SET title = ?, priority = ?, due_date = ?, column_id = ?, assigned_by = ?, task_desc = ? WHERE id = ?";
  const deleteOldAssigneesQuery =
    "DELETE FROM task_assignee WHERE task_id = ? AND user_id NOT IN (?)";
  const insertNewAssigneesQuery =
    "INSERT INTO task_assignee (task_id, user_id) VALUES ?"; // Using INSERT IGNORE

  try {
    await db.query("START TRANSACTION");

    // Update the task details
    await db.query(updateTaskQuery, [
      task_name,
      priority,
      due_date,
      status_id,
      assigned_by,
      task_desc,
      task_id,
    ]);

    // Delete users who were removed from the task
    await db.query(deleteOldAssigneesQuery, [task_id, userIds]);

    // Fetch existing users assigned to the task
    const [existingUsers] = await db.query(
      "SELECT user_id FROM task_assignee WHERE task_id = ?",
      [task_id]
    );

    console.log("Existing users:", existingUsers);

    const existingUserIds = Array.isArray(existingUsers)
      ? existingUsers.map((row) => row.user_id)
      : [];

    // Filter out users that are already assigned
    const newUsers = userIds.filter(
      (user_id) => !existingUserIds.includes(user_id)
    );

    if (newUsers.length > 0) {
      const values = newUsers.map((user_id) => [task_id, user_id]);
      // Use INSERT IGNORE to prevent duplicate entries
      await db.query(insertNewAssigneesQuery, [values]);
    }

    await db.query("COMMIT");

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.listen(4000, () => {
  console.log(`Server running at 4000`);
});
