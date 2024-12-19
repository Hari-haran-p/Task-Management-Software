import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/card-task.png";
import dot from "../assets/dots.png";
import TaskView from "./TaskView";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRefresh } from "../redux/refreshSlice";

export default function Task({ data, onDragStart }) {
  console.log(data);
  const dispatch = useDispatch();

  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);

  const handleActionClick = (event, userId) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleClickOutside = (event) => {
    // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //   setDropdownVisible(null);
    // }
    setDropdownVisible(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleStatusChange = async (status, data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/taskStatusChange",
        { data, status }
      );
      if (response.status === 200) {
        dispatch(setRefresh(true));
      }
    } catch (e) {
      console.log("Error updating task status", e);
    }
  };

  if (!data) {
    return (
      <div className="task">
        <h4 className="task-title heading-M">No task</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center lg:justify-start lg:items-start mb-10">
      <div className="w-full max-w-sm  rounded-xl relative shadow-xl">
        <div className="w-full h-14 bg-white flex items-center justify-between pl-4 pr-4 rounded-t-xl">
          <div className="flex gap-4">
            <div className="flex gap-3 rounded-xl items-center p-3 h-9 justify-center bg-card min-sm:w-24 sm:h-9">
              <img src={logo} alt="" className="w-3 h-3" />
              <div className="text-sm font-bold text-red-text">
                {data.status_id === 1
                  ? "ToDo"
                  : data.status_id === 2
                  ? "In Progress"
                  : "Done"}
              </div>
            </div>
            <div>
              <div className="flex gap-1 bg-F2EBFF rounded-xl items-center w-28 h-9 justify-center bg-card_1">
                <img
                  src={dot}
                  alt=""
                  className="h-3 w-3 text-orange-600 rounded-2xl"
                />
                <div className="text-sm font-bold text-orange-500">
                  {data.priority}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              // data-dropdown-toggle="apple-imac-27-dropdown"
              onClick={(e) => {
                handleActionClick(e, data.id);
                // getAssignedUsers(data.id);
              }}
              className={`inline-flex items-center p-0.5 text-sm font-medium text-center ${
                dropdownVisible === data.id ? "border" : ""
              }  text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100`}
              type="button"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {dropdownVisible === data.id && (
              <div
                ref={dropdownRef}
                className="absolute top-11 right-12  w-32 dropdown-content visible z-10 bg-white dark:bg-gray-800 shadow-md rounded-lg"
              >
                <ul
                  className="py-1 px-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="apple-imac-27-dropdown-button"
                >
                  <>
                    {
                      <li
                        className="block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          setIsTaskModalOpen(true);
                          // setViewData(data)
                        }}
                      >
                        View
                      </li>
                    }
                    {
                      <li
                        className="block py-1 px-4 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          handleStatusChange(1, data);
                          handleClickOutside();
                        }}
                      >
                        To Do
                      </li>
                    }
                    {
                      <li
                        className="block py-1 cursor-pointer px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          handleStatusChange(2, data);
                          dropdownVisible(false);
                        }}
                      >
                        In Progress
                      </li>
                    }
                    {
                      <li
                        className="block py-1 px-4 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          handleStatusChange(3, data);
                          dropdownVisible(false);
                        }}
                      >
                        Done
                      </li>
                    }
                  </>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-wrap items-center pl-5">
          <div
            title={data.task_name}
            className="font-extrabold cursor-pointer text-2xl"
          >
            {data.task_name}
          </div>
        </div>
        <div
          title={data.task_desc}
          className="w-full cursor-pointer h-24 pl-5 pt-2"
        >
          <div className="text-sm">{data.task_desc}</div>
        </div>

        <div className="w-full flex items-center h-12 rounded-b-xl border-t-2 border-gray-300 pl-5 ">
          <div className="flex justify-center gap-3 items-center">
            <div className="text-sm font-bold ">
              {formatDateToIST(data.due_date)}
            </div>
            {/* <div className="flex gap-1 bg-red-100 rounded-xl items-center w-28 h-9 justify-center bg-card_1"> */}
            {/* <img
                src={dot}
                alt=""
                className="h-3 w-3  rounded-2xl"
              /> */}
            <div className="text-sm font-bold text-red-500">
              {data.over_due === "Yes" ? "OverDue" : ""}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      {isTaskModalOpen && (
        <TaskView
          viewData={data}
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          // assignedUsers={assignedUsers}
          type="add"
        />
      )}
    </div>
  );
}
