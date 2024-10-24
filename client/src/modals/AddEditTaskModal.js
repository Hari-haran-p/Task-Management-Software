import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import "../styles/BoardModals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { Toast } from "primereact/toast";

export default function AddEditTaskModal({
  type,
  isTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const [levelBasedUser, setLevelBasedUser] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("userDetails"));
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [formData, setFormData] = useState({
    task_name: "",
    task_desc: "",
    priority: "Low",
    due_date: "",
    assigned_to: "",
    assigned_by: userDetail.id,
    status_id: 1,
    task_id: "",
  });

  const toast = useRef(null); // Toast ref

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "due_date") {
      const localDate = new Date(value);
      localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getUserByLevel = async (level) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/getUserByLevel`,
        { params: { level } }
      );
      setLevelBasedUser(response.data.results);
    } catch (err) {
      console.log({ "error fetching getUserByLevel": err });
    }
  };

  useEffect(() => {
    if (userDetail && userDetail.level !== undefined) {
      getUserByLevel(userDetail.level);
    }
  }, []);

  const { task_name, priority, due_date, status_id, assigned_by, task_desc } = formData;

  const showSuccess = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: message,
        life: 3000,
      });
    }
  };

  const showError = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    }
  };

  const user_ids = selectedUsers.map((user) => user.id);
  console.log(selectedUsers);
  

  const addNewTask = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/addNewTask`, {
        task_name: task_name,
        priority: priority,
        due_date: due_date,
        status_id: status_id,
        assigned_by: assigned_by,
        task_desc: task_desc,
        selectedUsers: user_ids,
      });
  
      if (response.status === 200) {
        showSuccess(response.data.message);  // Show success message
  
        // Check if the task was successfully added
        if (response.data.success === 2) {
          // Delay the refresh to allow the message to be shown
          setTimeout(() => {
            window.location.reload();
          }, 2000);  // 2-second delay before refresh
        }
      }
    } catch (err) {
      showError("Error adding task");
      console.log({ "error pushing NewTask": err });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewTask();
  };

  const handleSelect = (selectedList) => {
    setSelectedUsers(selectedList);
  };

  const handleRemove = (selectedList) => {
    setSelectedUsers(selectedList);
  };

  return (
    <div
      className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setIsAddTaskModalOpen(false);
      }}
    >
      <Toast ref={toast} /> {/* Toast component */}
      <form onSubmit={handleSubmit} className="modal">
        <h3>{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <label htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            value={formData.task_name}
            onChange={handleChange}
            id="task-name-input"
            name="task_name"
            type="text"
            required
            placeholder="e.g. Take coffee break"
          />
        </div>

        <label htmlFor="task-desc-input">Description</label>
        <div className="description-container">
          <textarea
            value={formData.task_desc}
            onChange={handleChange}
            required
            name="task_desc"
            id="task-desc-input"
            placeholder="e.g. This 15-minute break will recharge your batteries."
          />
        </div>

        <label htmlFor="priority-input">Priority</label>
        <div className="input-container">
          <select
            value={formData.priority}
            onChange={handleChange}
            name="priority"
            id="priority-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <label className="pt-5" htmlFor="due-date-input">Due Date</label>
        <div className="input-container">
          <input
            value={formData.due_date || ""}
            onChange={handleChange}
            name="due_date"
            id="due-date-input"
            type="date"
            required
          />
        </div>

        <label className="pt-5" htmlFor="assigned-to-input">Assigned To</label>
        <Multiselect
            required
            options={levelBasedUser} // Options from levelBasedUser data
            displayValue="email" // Display the user's email in the dropdown
            onSelect={handleSelect} // Function when an item is selected
            onRemove={handleRemove} // Function when an item is removed
            selectedValues={selectedUsers} // Keep track of selected values
            placeholder="Select users"
            style={{
              optionContainer: {
                // border: '1px solid #635fc7',
                fontSize: "12px",
              },
              chips: {
                // backgroundColor: '#635fc7',
                color: "white",
                borderRadius: "4px",
                padding: "5px",
                margin: "2px",
              },
            }}
          />

        <button type="submit" className="create-btn">
          Create Task   
        </button>
      </form>
    </div>
  );
}
