import React from 'react'

function TaskView({setIsAddTaskModalOpen,isTaskModalOpen,type}) {
  return (
    <div>
        <div
      className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      <form
        onSubmit={() => {
        //   addNewTask();
          setIsAddTaskModalOpen(false);
        }}
        className="modal"
      >
        <h3>{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <label htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            // value={formData.task_name}
            // onChange={handleChange}
            id="task-name-input"
            name="task_name"
            type="text"
            required
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
            // value={formData.task_desc}
            // onChange={handleChange}
            required
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
            // value={formData.priority}
            // onChange={handleChange}
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
            //   value={formData.due_date || ""} // Display formatted date or empty if not available
            //   onChange={handleChange}
              name="due_date"
              id="task-name-input"
              type="date"
              required
            />
          </div>

          <label htmlFor="assigned-to-input">Assigned To</label>
          
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
            //   value={formData.status_id}
            //   onChange={handleChange}
              name="status_id"
              id="task-name-input"
              required
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

        <button
          type="submit"
          // onClick={() => {

          // setIsAddTaskModalOpen(false)
          //   const isValid = validate();
          //   if (isValid) {
          //     onSubmit(type);
          // setIsAssignedEditOpen(false);
          //     type === "edit" && setIsTaskModalOpen(false);
          //   }
          // HandleSubmit();
          // }}

          className="create-btn"
        >
          Create Task
        </button>
      </form>
    </div>
    </div>
  )
}

export default TaskView