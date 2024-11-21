import React, { useEffect, useState, useRef } from "react";
import "../styles/BoardModals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { useDispatch } from "react-redux";
import { setRefresh } from "../redux/refreshSlice";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function AddEditTaskModal({
  type,
  isTaskModalOpen,
  setIsAddTaskModalOpen,
  prevColIndex = 0,
}) {
  const [levelBasedUser, setLevelBasedUser] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("userDetails"));
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
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

  const today = new Date();

  const toast = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "due_date") {
      // Parse the date from the input value (it may come as a string)
      const selectedDate = new Date(value);
      
      // Adjust the date by setting it to the local timezone (avoid timezone shift)
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
  
      // Update the state with the corrected local date
      setFormData({ ...formData, [name]: localDate });
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

  const triggerWorkflow = async () => {
    const name = "Hari";
    const email = "hariharan33587@gmail.com";
    try {
      const response = await axios.post(
        `http://localhost:4000/api/triggerWorkflow`,
        { name , email}
      );
      setLevelBasedUser(response.data.results);
      console.log(response.data.message);
      
    } catch (err) {
      console.log({ "error triggerWorkflow": err });
    }
  };

  useEffect(() => {
    if (userDetail && userDetail.level !== undefined) {
      getUserByLevel(userDetail.level);
    }
    triggerWorkflow();
  }, []);

  const { task_name, priority, due_date, status_id, assigned_by, task_desc } =
    formData;

  const user_ids = selectedUsers.map((user) => user.id);
  // console.log(selectedUsers);

  // const successNotify = () => toast.success("zfvb");
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  const [taskAdded, setTaskAdded] = useState(false);

  // Toast show effect
  useEffect(() => {
    if (taskAdded) {
      console.log("have");

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Task Created Successfully",
        life: 3000,
      });

      // Reset the flag after showing the toast
    }
  }, [taskAdded]);

  const addNewTask = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/addNewTask`,
        {
          task_name: task_name,
          priority: priority,
          due_date: due_date,
          status_id: status_id,
          assigned_by: assigned_by,
          task_desc: task_desc,
          selectedUsers: user_ids,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        triggerWorkflow();
      }
      setTaskAdded(true);
      dispatch(setRefresh(true));
    } catch (err) {
      console.log({ "error pushing NewTask": err });
    }
  };
  console.log(taskAdded);

  const handleSubmit = () => {
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
      {/* <ToastContainer /> */}
      <Toast ref={toast} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          setIsAddTaskModalOpen(false);
        }}
        className="modal"
      >
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

        <label className="pt-5" htmlFor="due-date-input">
          Due Date
        </label>
        <div className="input-container">
          <Calendar
            className="w-full"
            value={formData.due_date || ""}
            name="due_date"
            onChange={handleChange}
            dateFormat="dd-mm-yy"
            minDate={today} // Disable past dates
            placeholder="Select a date"
            id="due-date-input"
          />
        </div>

        <label className="pt-5" htmlFor="assigned-to-input">
          Assigned To
        </label>
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

        <button onClick={showSuccess} type="submit" className="create-btn">
          Create Task
        </button>
      </form>
    </div>
  );
}
