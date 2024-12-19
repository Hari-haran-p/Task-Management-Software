import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    level: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name || !formData.level) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/adduser", formData);

      if (response.status === 201) {
        toast.success("User added successfully!");
        setFormData({ email: "", password: "", name: "", level: "" }); // Clear form
      } else {
        toast.error("Failed to add user. Please try again.");
      }
    } catch (error) {
      console.error("Error adding user:", error.message);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>

      <form
        onSubmit={handleSubmit}
        className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium mb-1">
            Level
          </label>
          <input
            type="number"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Enter user level"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-sm text-white font-medium py-2 rounded-lg hover:bg-blue-600"
        >
          Add User
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
