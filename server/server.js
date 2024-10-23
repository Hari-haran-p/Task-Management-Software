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
      res.json({ results });
      // console.log(results);
    } else {
      res.status(401).json({ message: "No tasks found for this user" });
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
    if (results.length > 0) {
      res.json({ results });
    } else {
      res.status(401).json({ message: "No tasks found for this user" });
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.post("/api/deleteTask", async (req, res) => {
  const taskId = req.body.taskId;
  const deleteTaskQuery = "DELETE FROM tasks WHERE id = ?";
  const deleteTaskAssigneesQuery = "DELETE FROM task_assignees WHERE task_id = ?";

  try {
    // Start a transaction
    await db.query("START TRANSACTION");
    await db.query(deleteTaskAssigneesQuery, [taskId]);

    const results = await db.query(deleteTaskQuery, [taskId]);

    if (results.affectedRows > 0) {
      await db.query("COMMIT");
      res.json({ message: "Task deleted successfully" });
    } else {
      await db.query("ROLLBACK");
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error", error: err });
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
  const {
    task_name,
    priority,
    due_date,
    status_id,
    assigned_by,
    task_desc,
    selectedUsers,
  } = req.body; // Get selectedUsers

  const taskQuery =
    "INSERT INTO tasks (title, priority, due_date, column_id, assigned_by, task_desc) VALUES(?,?,?,?,?,?)";
  const userTaskQuery =
    "INSERT INTO task_assignees (task_id, user_id) VALUES ?";

  // Start a transaction
  try {
    await db.query("START TRANSACTION");

    // Insert the task into the database
    const taskResult = await db.query(taskQuery, [
      task_name,
      priority,
      due_date,
      status_id,
      assigned_by,
      task_desc,
    ]);
    const task_id = taskResult.insertId; // Get the inserted task's ID

    // Prepare the values for bulk insert into task_assignees
    const values = selectedUsers.map((user_id) => [task_id, user_id]);

    // Insert all selected users for the task
    await db.query(userTaskQuery, [values]);

    // Commit the transaction since all queries succeeded
    await db.query("COMMIT");
    
    if (taskResult.affectedRows > 0) {
      res.json({ message: "Task added Successfully" });
    }
  } catch (err) {
    // Rollback the transaction in case of an error
    await db.query("ROLLBACK");
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

app.put("/api/updateTaskData", async (req, res) => {
  const {
    task_id,
    assigned_to_id,
    task_name,
    priority,
    due_date,
    assigned_by_id,
    task_desc,
    status_id,
  } = req.body;
  console.log(req.body);

  try {
    // Update the task in the tasks table using the provided status_id
    const updateResult = await db.query(
      "UPDATE tasks SET title = ?, priority = ?, due_date = ?, column_id = ?, assigned_by = ?, task_desc = ? WHERE id = ?",
      [
        task_name,
        priority,
        due_date,
        status_id,
        assigned_by_id,
        task_desc,
        task_id,
      ]
    );

    // Check if the task was updated
    if (updateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or no changes made." });
    }

    // Check if the task_id and assigned_to_id already exist in task_assignees
    const existingAssignment = await db.query(
      "SELECT * FROM task_assignees WHERE task_id = ? AND user_id = ?",
      [task_id, assigned_to_id]
    );

    if (existingAssignment.length === 0) {
      // If no existing entry, insert new assignment
      await db.query(
        "INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)",
        [task_id, assigned_to_id]
      );
    } else {
      // If entry exists, you can update it if needed (optional)
      await db.query(
        "UPDATE task_assignees SET user_id = ? WHERE task_id = ?",
        [assigned_to_id, task_id]
      );
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
});

app.listen(4000, () => {
  console.log(`Server running at 4000`);
});
