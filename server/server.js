const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./Database/db.js");
const cron = require("node-cron");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const addMessage = async (data) => {
  const { message, userEmail, userName } = data;
  const query = `INSERT INTO messages (message, email, name) VALUES (?, ?, ?)`;
  try {
    const response = await db.query(query, [message, userEmail, userName]);
    if (response.affectedRows > 0) {
      console.log("Message inserted successfully");
    } else {
      console.log("Failed to insert message");
    }
  } catch (error) {
    console.log({ "error inserting message": error });
  }
};


const fetchMessages = async () => {
  const query = `SELECT * FROM messages`;
  try {
    const response = await db.query(query);
    if (response.length > 0) {
      // console.log("Messages fetched successfully");
      return response; // Return all messages
    } else {
      console.log("No messages found");
      return [];
    }
  } catch (error) {
    console.log({ "error fetching messages": error });
    return [];
  }
};


// fetchMessages();

const deleteMessage = async (messageId) => {
  const query = `DELETE FROM messages WHERE id = ?`;
  try {
    const response = await db.query(query, [messageId]);
    if (response.affectedRows > 0) {
      console.log("Message deleted successfully");
    } else {
      console.log("Failed to delete message");
    }
  } catch (error) {
    console.log({ "error deleting message": error });
  }
};

io.on("connection", async (socket) => {
  console.log("A user connected");

  // Fetch initial messages and send to the client
  const initialMessages = await fetchMessages();
  socket.emit("initMessage", initialMessages);

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    console.log("Message received:", data);
    await addMessage(data); // Insert message into DB
    const updatedMessages = await fetchMessages(); // Fetch all messages
    io.emit("broadcastMessage", updatedMessages); // Broadcast to all clients
  });

  // Handle message deletion
  socket.on("deleteMessage", async (messageId) => {
    console.log("Message to delete:", messageId);
    await deleteMessage(messageId); // Delete the message from DB
    const updatedMessages = await fetchMessages(); // Fetch updated messages
    io.emit("broadcastMessage", updatedMessages); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


app.use(cors());
app.use(
  bodyParser.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const nodemailer = require("nodemailer");
const { log } = require("console");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hariharan33587@gmail.com", // Your Gmail address
    pass: process.env.MAIL_PASS, // Your Gmail password or App Password
  },
});

// var mailOptions = {
//   from: "hariharan33587@gmail.com",
//   to: "",
//   subject: "Test Email",
//   text: "Hello, this is a test email sent using Gmail SMTP and Node.js.",
// };

const sendMail = (to, subject, text) => {
  var mailOptions = {
    from: "hariharan33587@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  try {
    const results = await db.query(query, [email, password]); // Assuming db.query is asynchronous and returns a promise
    if (results.length > 0) {
      const user = results[0];
      // mailOptions.to = user.email;
      // sendMail(user.email,"Login","congrats");
      res.json({
        id: user.id,
        email: user.email,
        level: user.level,
        name: user.name,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});

// const over_due = async function (req, res) {
//   try {
//     const query = `
//       UPDATE tasks
//       SET over_due = 'Yes'
//       WHERE DATE(due_date) < CURDATE()
//       AND over_due = 'No'
//       AND column_id != 3;
//     `;
//     await db.query(query);
//     console.log("updated successfully");

//     // res.status(200).json({ message: "Overdue tasks updated successfully" });
//   } catch (error) {
//     console.error("Error updating overdue tasks:", error);
//     // res.status(500).json({ message: "Failed to update overdue tasks" });
//   }
// }

cron.schedule("0 0 * * *", async function () {
  try {
    // Update overdue tasks and fetch newly updated rows
    const fetchNewOverdueQuery = `
      UPDATE tasks
      SET over_due = 'Yes'
      WHERE DATE(due_date) < CURDATE()
      AND over_due = 'No'
      AND column_id != 3;
    `;

    // First, update the tasks
    db.query(fetchNewOverdueQuery, async (error, result) => {
      if (error) {
        console.error("Error updating overdue tasks:", error);
        return;
      }
      console.log("Overdue tasks updated successfully");

      // If no rows were affected, exit
      if (result.affectedRows === 0) {
        console.log("No new overdue tasks to update.");
        return;
      }

      // Now fetch only the updated rows
      const getNewOverdueTasksQuery = `
          SELECT task_name, due_date, assigned_to , task_desc
          FROM task_details_view
          WHERE over_due = 'Yes'
          AND DATE(due_date) < CURDATE()
          AND DATE(updated_at) = CURDATE();
      `;

      db.query(getNewOverdueTasksQuery, (error, results) => {
        if (error) {
          console.error("Error fetching new overdue tasks:", error);
          return;
        }

        // Send emails to only newly overdue tasks
        results.forEach((task) => {
          const subject = `Task Overdue Notification: ${task.task_name}`;
          const text = `Your task "${task.task_name}" is now overdue as the deadline (${task.due_date}) has passed. Please take the necessary actions.`;
          sendMail(task.assigned_to, subject, text);
        });
      });
    });
  } catch (error) {
    console.error("Error in cron job:", error);
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
  const deleteTaskAssigneesQuery =
    "DELETE FROM task_assignee WHERE task_id = ?";

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
    // console.log("Deleted task assignees:", deleteAssigneesResult.affectedRows);

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

app.post("/api/taskStatusChange", async (req, res) => {
  const status = req.body.status;
  const taskId = req.body.data.task_id;
  // console.log(status, taskId);

  const query = "update tasks set column_id = ? where id = ?";

  try {
    const results = await db.query(query, [status, taskId]);
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

    console.log({ date: due_date });
    const dateOnly = new Date(due_date).toISOString().split("T")[0];
    console.log(dateOnly); // Output: 2024-12-18

    // console.log("Starting transaction...");
    // console.log("Task Details:", { task_name, priority, due_date1, status_id, assigned_by, task_desc });
    // console.log("Selected Users:", selectedUsers); // Log for debugging

    const taskQuery =
      "INSERT INTO tasks (title, priority, due_date, column_id, assigned_by, task_desc) VALUES(?,?,?,?,?,?)";
    const userTaskQuery =
      "INSERT INTO task_assignee (task_id, user_id) VALUES ?";

    // Insert the task
    const taskResult = await new Promise((resolve, reject) => {
      connection.query(
        taskQuery,
        [task_name, priority, dateOnly, status_id, assigned_by, task_desc],
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

    await connection.commit();

    const fetchUserEmails = async () => {
      try {
        const userEmails = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT email FROM users WHERE id IN (?)",
            [selectedUsers],
            (error, results) => {
              if (error) return reject(error);

              if (results.length > 0) {
                const emails = results.map((row) => row.email);
                resolve(emails);
              } else {
                reject("No users found with the provided IDs");
              }
            }
          );
        });

        sendMail(
          userEmails,
          "Task Added: " + task_name,
          "Description: " + task_desc
        );
      } catch (error) {
        console.error("Error fetching user emails or sending email:", error);
      }
    };
    fetchUserEmails();
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
    title,
    priority,
    due_date,
    status_id,
    assigned_by,
    task_desc,
    selectedUsers,
  } = req.body;

  if (!Array.isArray(selectedUsers)) {
    return res.status(400).json({ message: "Invalid selectedUsers format" });
  }

  const updateTaskQuery = `
    UPDATE tasks 
    SET title = ?, priority = ?, due_date = ?, column_id = ?, assigned_by = ?, task_desc = ? 
    WHERE id = ?
  `;

  const deleteOldAssigneesQuery = selectedUsers.length
    ? `DELETE FROM task_assignee WHERE task_id = ? AND user_id NOT IN (${selectedUsers
        .map(() => "?")
        .join(",")})`
    : `DELETE FROM task_assignee WHERE task_id = ?`; // Deletes all if no selectedUsers

  const insertNewAssigneesQuery = `INSERT IGNORE INTO task_assignee (task_id, user_id) VALUES ?`;

  try {
    await db.query("START TRANSACTION");

    // Update the task details
    await db.query(updateTaskQuery, [
      title,
      priority,
      due_date,
      status_id,
      assigned_by,
      task_desc,
      task_id,
    ]);

    // Delete users who were removed from the task
    if (selectedUsers.length) {
      await db.query(deleteOldAssigneesQuery, [task_id, ...selectedUsers]);
    } else {
      await db.query(deleteOldAssigneesQuery, [task_id]);
    }

    // Fetch existing users assigned to the task
    // Fetch existing users assigned to the task
    const result = await db.query(
      "SELECT user_id FROM task_assignee WHERE task_id = ?",
      [task_id]
    );
    const existingUsers = Array.isArray(result[0]) ? result[0] : [];
    const existingUserIds = existingUsers.map((row) => row.user_id);

    // Filter out users that are already assigned
    const newUsers = selectedUsers.filter(
      (user_id) => !existingUserIds.includes(user_id)
    );

    // Insert new users if there are any
    if (newUsers.length > 0) {
      const values = newUsers.map((user_id) => [task_id, user_id]);
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


app.post("/api/adduser", (req, res) => {
  const { email, password, name, level } = req.body;

  if (!email || !password || !name || !level) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const query = "INSERT INTO users (email, password, name, level) VALUES (?, ?, ?, ?)";
  db.query(query, [email, password, name, level], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to add user" });
    }
    console.log("User added successfully:", result);
    res.status(201).json({ message: "User added successfully!" }); // Verify this is sent
  });
});


// app.get("/", (req, res) => {
//   res.send("Hello from backend");
//   // res.json({ message: 'Hello from backend' });
// });

// app.get("/messages", (req, res) => {
//   res.json([]); // Mock message data
// });

server.listen(4000, () => {
  console.log(`Server running at 4000`);
});
