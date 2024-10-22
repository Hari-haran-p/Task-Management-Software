import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignedEdit({ data, setOpenEdit }) {
  console.log(data);

  const [formData, setFormData] = useState({
    task_name: "",
    task_desc: "",
    priority: "",
    due_date: "",
    assigned_to: "",
    assigned_by: "",
    status_id: "",
    task_id: "",
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);


  const HandleSubmit = async (e) => {
    if (window.confirm("Are you sure want to update ?")) {
      // setIsLoading(true);
      // e.preventDefault();  
      try {
        const response = await axios.put(
          "http://localhost:4000/api/updateTaskData",
          formData
        );

        if (response.status == 201) {
          console.log(response);
          // setMessage(response.data.Data);
          // onClose();
          // setIsLoading(false);
        }
        // setMessage(response.data);
      } catch (error) {
        if (error.response) {
          // setError(error.response.data.Data);
          // onClose();
          // setIsLoading(false);
        }
        console.log(error);
      }
    }
  };


  useEffect(() => {
    if (data) {
      const formattedData = {
        ...data,
        due_date: formatDate(new Date(data.due_date)) // Format due_date from Date() to YYYY-MM-DD
      };
      setFormData(formattedData);
    }
  }, [data]);
  
  // Function to format Date object to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "due_date") {
      const localDate = new Date(value);
      // Convert local date to ensure correct handling
      localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
      setFormData({ ...formData, [name]: value }); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  console.log(formData);

  var type = "add";

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
        <h3>{type === "edit" ? "Edit" : "Add New"} Task</h3>
        <label htmlFor="task-name-input">Task Id</label>
        <div className="input-container">
          <input
            value={formData.task_id} // Changed from data.task_id to formData.task_id
            id="task-name-input"
            type="text"
            name="task_id"
            disabled
          />
        </div>

        <label htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            value={formData.task_name}
            onChange={handleChange}
            id="task-name-input"
            name="task_name"
            type="text"
            placeholder="e.g. Take coffee break"
            // className={!isValid && !title.trim() ? "red-border" : ""}
          />
          {/* {!isValid && !title.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}  */}
        </div>
        <label htmlFor="task-name-input">Description</label>
        <div className="description-container">
          <textarea
            value={formData.task_desc}
            onChange={handleChange}
            name="task_desc"
            id="task-description-input"
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>
        <label htmlFor="task-name-input">Priority</label>
        <div className="input-container">
          <select
            value={formData.priority}
            onChange={handleChange}
            name="priority"
            id="task-name-input"
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label htmlFor="task-name-input">Due Date</label>
          <div className="input-container">
            <input
              value={formData.due_date || ""} // Display formatted date or empty if not available
              onChange={handleChange}
              name="due_date"
              id="task-name-input"
              type="date"
            />
          </div>

          <label htmlFor="task-name-input">Assigned To</label>
          <div className="input-container">
            <input
              value={formData.assigned_to}
              onChange={handleChange}
              name="assigned_to"
              id="task-name-input"
              type="text"
              placeholder="e.g. Take coffee break"
              // className={!isValid && !title.trim() ? "red-border" : ""}
            />
            {/* {!isValid && !title.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}  */}
          </div>
          {/* <label htmlFor="task-name-input">Assigned By</label>
          <div className="input-container">
            <input
              value={formData.assigned_by}
              // onChange={(e) => setTitle(e.target.value)}
              id="task-name-input"
              type="text"
              placeholder="e.g. Take coffee break"
              // className={!isValid && !title.trim() ? "red-border" : ""}
            />
            {!isValid && !title.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )} 
          </div> */}

          <label htmlFor="task-name-input">Status</label>
          <div className="input-container">
            <select
              value={formData.status_id}
              onChange={handleChange}
              name="status_id"
              id="task-name-input"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="1">To Do</option>
              <option value="2">In Progress</option>
              <option value="3">Done</option>
            </select>
          </div>
          {/* {!isValid && !title.trim() && (
         <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )} */}
        </div>

        {/* <label>Subtasks</label>
        <div className="modal-columns">
          {subtasks.map((subtask, index) => {
            return (
              <div className="modal-column" key={index}>
                <div className="input-container">
                  <input
                    // onChange={(e) => {
                    //   onChangeSubtasks(subtask.id, e.target.value);
                    // }}
                    type="text"
                    value={subtask.title}
                    className={
                      !isValid && !subtask.title.trim() ? "red-border" : ""
                    }
                  />
                  {!isValid && !subtask.title.trim() ? (
                    <span className="cant-be-empty-span text-L">
                      {" "}
                      Can't be empty
                    </span>
                  ) : null}
                </div>
                <img
                  src={crossIcon}
                  alt="delete-column-icon"
                  onClick={() => {
                    // onDelete(subtask.id);
                  }}
                />
              </div>
            );
          })}
        </div> */}

        {/* <button
          onClick={() => {
            setSubtasks((state) => [
              ...state,
              { title: "", isCompleted: false, id: uuidv4() },
            ]);
          }}
          className="add-column-btn btn-light"
        >
          + Add New Subtask
        </button>

        <div className="select-column-container">
          <label className="text-M">Current Status</label>
          <select
            className="select-status text-L"
            value={status}
            onChange={onChangeStatus}
          >
            {columns.map((col, index) => (
              <option className="status-options" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div> */}

        <button
          onClick={() => {
            //   const isValid = validate();
            //   if (isValid) {
            //     onSubmit(type);
            // setIsAssignedEditOpen(false);
            //     type === "edit" && setIsTaskModalOpen(false);
            //   }
            HandleSubmit();
          }}
          className="create-btn"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}

export default AssignedEdit;
