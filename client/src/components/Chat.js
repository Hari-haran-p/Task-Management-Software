import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaTrash } from "react-icons/fa"; // Import the trash icon from react-icons

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userEmail = userDetails ? userDetails.email : null;

  useEffect(() => {
    // Initialize chat with existing messages
    socket.on("initMessage", (messageData) => {
      setMessages(messageData);
    });

    // Listen for new messages
    socket.on("broadcastMessage", (messageData) => {
      setMessages(messageData);
    });

    return () => {
      socket.off("initMessage");
      socket.off("broadcastMessage");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        userEmail: userDetails?.email || "Unknown",
        userName: userDetails?.name || "Anonymous",
        message,
      };
      socket.emit("sendMessage", messageData);
      setMessage(""); // Clear the input field after sending the message
    } else {
      alert("Please enter a message!");
    }
  };

  // Handle Enter key press to submit the message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(); // Send the message when Enter key is pressed
    }
  };

  // Handle deleting a message
  const handleDeleteMessage = (messageId) => {
    const confirmDelete = window.confirm("Do you want to delete this message?");
    if (confirmDelete) {
      socket.emit("deleteMessage", messageId); // Emit delete request to server
    }
  };

  return (
    <div className="p-10 relative flex justify-center items-center flex-col space-y-4">
      <h1 className="text-2xl w-1/2 font-bold text-center">Group Chat</h1>

      <div
        id="chatBox"
        className="h-[300px] overflow-y-scroll border rounded-lg w-1/2 border-gray-300 p-4"
      >
        {messages.slice(-20).map((msg, index) => (
          <div
          key={index}
          className={`flex ${msg.email === userEmail ? "justify-end" : "justify-start"} items-end mb-3 relative`}
        >
          <div
            className={`flex flex-col ${msg.email === userEmail ? "items-end" : "items-start"} max-w-xs group`}
          >
            <span className="text-sm font-bold">{msg.name}</span>
            
            {/* Message box with hover effect */}
            <div
              className={`p-3 rounded-lg cursor-pointer text-sm ${msg.email === userEmail ? "bg-blue-500 text-white" : "bg-gray-200"} group-hover:bg-opacity-70`}
            >
              {msg.message}
            </div>
        
            {/* Delete button only visible on hover */}
            {msg.email === userEmail && (
              <button
                onClick={() => handleDeleteMessage(msg.id)} // Pass the message id
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash className="h-4 w-4" /> {/* Trash icon */}
              </button>
            )}
          </div>
        </div>
        
        ))}
      </div>

      <div className="flex w-1/2 items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="border-2 w-full rounded-lg pl-2 text-sm h-12"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 text-sm rounded h-12"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
