import React, { useState } from "react";
import axios from "axios";

const Demo = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/send-email", { name, email });
      setResponse(res.data.message);
    } catch (error) {
      setResponse("Failed to send email.");
    }
    setLoading(false);
  };

  return (
    <div className="email-container">
      <h1>Send Email Notification</h1>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
      </button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default Demo;
