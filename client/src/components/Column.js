import React from "react";
import Task from "./Task";
import "../styles/Column&Task.css";

export default function Column({ taskData }) {
  const handleOnDrop = (e) => {
    e.preventDefault();
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );
    // Handle drop logic here
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  if (!Array.isArray(taskData)) {
    return <div>Loading tasks...</div>;
  }

  const columns = {
    "To Do": [],
    "In Progress": [],
    Done: [],
  };

  for (const task of taskData) {
    if (columns[task.status]) {
      columns[task.status].push(task);
    }
  }

  return (
    <div className="column " onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
      {Object.keys(columns).map((columnName) => (
        <div className="w-96" key={columnName}>
          <p className="col-name heading-S">{columnName}</p>
          {columns[columnName].length > 0 ? (
            columns[columnName].map((task, index) => (
              <Task key={index} data={task} />
            ))
          ) : (
            <Task taskData={null} />
          )}
        </div>
      ))}
    </div>
  );
}
