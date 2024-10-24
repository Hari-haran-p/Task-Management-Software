import React, { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css"; 
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";

function AssignedEdit({ data, setOpenEdit, assignedUsers, setAssignedUsers }) {
  const [formData, setFormData] = useState({
    title: "",
    task_desc: "",
    priority: "",
    due_date: "",
    assigned_to: "",
    assigned_by: "",
    status_id: 1,
    id: "",
  });

  const [levelBasedUser, setLevelBasedUser] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("userDetails"));
  
  // Fetch eligible users based on level
  const getUserByLevel = async (level) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/getUserByLevel`, {
        params: { level },
      });
      setLevelBasedUser(response.data.results);
    } catch (err) {
      console.log({ "error fetching getUserByLevel": err });
    }
  };

  // Set form data when the component loads
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        due_date: formatDate(new Date(data.due_date)),
      });
    }
  }, [data]);

  // Fetch eligible users once when the component mounts
  useEffect(() => {
    if (userDetail) {
      getUserByLevel(userDetail.level); // Pass user's level to fetch eligible users
    }
  }, [userDetail]);

  // Function to format Date object to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { id, task_name, priority, due_date, status_id, assigned_by, task_desc } = formData;
  // console.log(formData);
  

  const user_ids = assignedUsers.map((user) => user.user_id);
  // console.log(user_ids);
  
  
  const HandleSubmit = async () => {
    if (window.confirm("Are you sure you want to update?")) {
      try {
        const response = await axios.post("http://localhost:4000/api/updateTask", {
          task_id: id,
          task_name: task_name,
          priority: priority,
          due_date: due_date,
          status_id: status_id,
          assigned_by: assigned_by,
          task_desc: task_desc,
          selectedUsers: user_ids,
        });
  
        if (response.status === 200) { // 200 for a successful update
          console.log("Task updated successfully");
        }
      } catch (error) {
        console.log("Error updating task:", error);
      }
    }
  };
  

  // Handle selecting users in the dropdown
  const handleSelect = (selectedList) => {
    setAssignedUsers(selectedList); // Update the assignedUsers state with selected users
  };

  // Handle removing users in the dropdown
  const handleRemove = (selectedList) => {
    setAssignedUsers(selectedList); // Update the assignedUsers state when users are removed
  };


  const combinedUserList = [...levelBasedUser, ...assignedUsers].filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );

  console.log({"ass":assignedUsers});
  

  var type = "add"

  return (
    <div
    className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenEdit(false);
      }}
    >
      <div className="modal">
        <h3>Edit Task</h3>

        <label htmlFor="task-id-input">Task Id</label>
        <div className="input-container">
          <input
            value={formData.id}
            id="task-id-input"
            type="text"
            name="id"
            disabled
          />
        </div>

        <label className="pt-5" htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            value={formData.title}
            onChange={handleChange}
            id="task-name-input"
            name="title"
            type="text"
            placeholder="Task Name"
          />
        </div>

        <label htmlFor="task-desc-input">Description</label>
        <div className="input-container">
          <textarea
            value={formData.task_desc}
            onChange={handleChange}
            name="task_desc"
            id="task-desc-input"
            placeholder="Task Description"
          />
        </div>

        <label htmlFor="priority-select">Priority</label>
        <div className="input-container">
          <select
            value={formData.priority}
            onChange={handleChange}
            name="priority"
            id="priority-select"
          >
            <option value="" disabled>Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <label className="pt-5" htmlFor="due-date-input">Due Date</label>
        <div className="input-container">
          <input
            value={formData.due_date}
            onChange={handleChange}
            name="due_date"
            id="due-date-input"
            type="date"
          />
        </div>

        <label className="pt-5" htmlFor="assigned-users-select">Assigned To</label>
        <Multiselect
        options={combinedUserList} // Options from levelBasedUser + assignedUsers
        displayValue="email" // Display user's email in the dropdown
        onSelect={handleSelect} // Handle select
        onRemove={handleRemove} // Handle remove
        selectedValues={assignedUsers} // Pre-select assignedUsers as chips
        placeholder="Select users"
        style={{
          optionContainer: {
            fontSize: "12px",
          },
          chips: {
            color: "white",
            borderRadius: "4px",
            padding: "5px",
            margin: "2px",
          },
        }}
      />

        {/* <label htmlFor="status-select">Status</label>
        <div className="input-container">
          <select
            value={formData.status_id}
            onChange={handleChange}
            name="status_id"
            id="status-select"
          >
            <option value="" disabled>Select Status</option>
            <option value="1">To Do</option>
            <option value="2">In Progress</option>
            <option value="3">Done</option>
          </select>
        </div> */}

        <button onClick={HandleSubmit} className="create-btn">
          Update Task
        </button>
      </div>
    </div>
  );
}

export default AssignedEdit;
