import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";

function TaskView({
  setIsAddTaskModalOpen,
  assignedUsers,
  viewData,
}) {

  function formatDateToIST(date) {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset() + 330); // Adding 330 minutes for IST
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  console.log(viewData);
  
  var type = "add"

  return (
    <div
      className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      <div className="modal">
        <h3>View Task</h3>

        <label htmlFor="task-id-input">Task Id</label>
        <div className="input-container">
          <input
            value={viewData.id}
            id="task-id-input"
            type="text"
            name="id"
            disabled
          />
        </div>

        <label className="pt-5" htmlFor="task-name-input">
          Task Name
        </label>
        <div className="input-container">
          <input
            value={viewData.title}
            id="task-name-input"
            name="title"
            type="text"
            disabled
          />
        </div>

        <label htmlFor="task-desc-input">Description</label>
        <div className="input-container">
          <textarea
            value={viewData.task_desc}
            disabled
            name="task_desc"
            id="task-desc-input"
          />
        </div>

        <label htmlFor="priority-select">Priority</label>
        <div className="input-container">
          <select
            value={viewData.priority}
            disabled
            name="priority"
            id="priority-select"
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <label className="pt-5" htmlFor="due-date-input">
          Due Date
        </label>
        <div className="input-container">
          <input
            value={formatDateToIST(viewData.due_date)}
            disabled
            name="due_date"
            id="due-date-input"
            type="date"
          />
        </div>

        <label className="pt-5" htmlFor="assigned-users-select">
          Assigned To
        </label>
        <Multiselect
          displayValue="email" // Display user's email in the dropdown
          selectedValues={assignedUsers} // Pre-select assignedUsers as chips
          disable
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
      </div>
    </div>
  );
}

export default TaskView;
