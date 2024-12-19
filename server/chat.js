// // const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// // const mysql = require("mysql");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow frontend to connect
//     methods: ["GET", "POST"],
//   },
// });

// // WebSocket connection
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Fetch and send all messages when a user connects
//   db.query("SELECT * FROM messages", (err, results) => {
//     if (err) throw err;
//     socket.emit("load_messages", results);
//   });

//   // Listen for new messages
//   socket.on("send_message", (data) => {
//     const { sender, message } = data;

//     // Save message to database
//     db.query(
//       "INSERT INTO messages (sender, message) VALUES (?, ?)",
//       [sender, message],
//       (err, result) => {
//         if (err) throw err;

//         // Broadcast message to all connected clients
//         io.emit("receive_message", {
//           id: result.insertId,
//           sender,
//           message,
//           created_at: new Date(),
//         });
//       }
//     );
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

