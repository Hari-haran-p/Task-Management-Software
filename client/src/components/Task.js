import React from "react";

export default function Task({ taskData }) {
  if (!taskData) {
    // Render empty card when taskData doesn't exist
    return (
      <div className="task">
        <h4 className="task-title heading-M">No task</h4>
      </div>
    );
  }

  // If taskData exists, render the task details
  // const dueDate = new Date(taskData.due_date);
  // const formattedDate = `${String(dueDate.getDate()).padStart(2, '0')}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${dueDate.getFullYear()}`;

  return (
    <div className="task">
      <h4 className="task-title heading-M">{taskData.task_title}</h4>
      <p className="text-xs truncate flex text-wrap w-full">{taskData.task_desc}</p>
      <p className="text-xs">{taskData.due_date}</p>
    </div>
  );
}
