import React, { useRef } from "react";
import { useEffect, useState } from "react";
import AssignedEdit from "./AssignedEdit";
import "../styles/Card.css";
import "primereact/resources/themes/saga-blue/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; // for icons

import axios from "axios";
import { Toast } from "primereact/toast";
import TaskView from "./TaskView";

function AssignedTask({ assignedData, getAssignedData }) {
  // for edit popup
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  // const [openOptions, setOpenOptions] = useState(false);
  // const [openOptionsTaskId, setOpenOptionsTaskId] = useState(null);
  // console.log({"ha":assignedData});

  // console.log(assignedData);

  const handleOpenEdit = (data) => {
    setOpenEdit(true);
    setEditData(data);
  };

  const onSubmit = () => {
    getAssignedData();
  };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (click || searchQuery === "") {
      const filteredResults = assignedData.filter((item) => {
        const propertiesToSearch = [
          "title",
          "task_desc",
          "priority",
          "due_date",
          "assigned_to",
          "column_id",
          "id",
        ];
        return propertiesToSearch.some((property) =>
          typeof item[property] === "string"
            ? item[property].toLowerCase().includes(searchQuery.toLowerCase())
            : typeof item[property] === "number"
            ? item[property].toString().includes(searchQuery)
            : false
        );
      });

      setFilteredData(filteredResults);
    }
  }, [click, assignedData, searchQuery]);

  // Sort functionality
  const [sortOrders, setSortOrders] = useState({
    title: "asc",
    task_desc: "asc",
    priority: "asc",
    due_date: "asc",
    assigned_to: "asc",
    column_id: "asc",
    id: "asc",
  });

  const [sortedColumn, setSortedColumn] = useState("");

  const handleSort = (column) => {
    setSortOrders((prevSortOrders) => ({
      ...prevSortOrders,
      [column]: prevSortOrders[column] === "asc" ? "desc" : "asc",
    }));

    setSortedColumn(column);

    filteredData.sort((a, b) => {
      const valueA =
        typeof a[column] === "string" ? a[column].toLowerCase() : a[column];
      const valueB =
        typeof b[column] === "string" ? b[column].toLowerCase() : b[column];

      if (valueA < valueB) {
        return sortOrders[column] === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrders[column] === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(filteredData);
  };

  // Enter key for search
  const handleKeyEnter = (e) => {
    if (e.key === "Enter") {
      setClick(true);
    }
  };

  // Format date to IST
  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);
  // const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = (event, userId) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(null);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      if (!taskId) {
        console.error("Task ID is not available");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/deleteTask`,
        {
          taskId: taskId,
        }
      );

      const serverMessage = response.data.message;

      if (response.status === 200) {
        // Check if the server responded successfully
        if (response.data.success === 1) {
          showSuccess(serverMessage); // Show the message first

          // Delay the page refresh by 2 seconds (adjust as needed)
          setTimeout(() => {
            refreshPage();
          }, 2000);
        }
      }
    } catch (e) {
      showError("Error deleting task");
      console.log("Error deleting task", e);
    }
  };

  const [assignedUsers, setAssignedUsers] = useState();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  // console.log({ ass: assignedUsers });

  const getAssignedUsers = async (taskId) => {
    try {
      if (!taskId) {
        console.error("Task ID is not available");
        return;
      }
      const response = await axios.post(
        `http://localhost:4000/api/getAssignedUsers`,
        {
          taskId: taskId,
        }
      );
      setAssignedUsers(response.data);
    } catch (e) {
      showError("Error deleting task");
      console.log("Error deleting task", e);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const refreshPage = () => {
    window.location.reload();
  };

  const toast = useRef(null);

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
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-2xl font-semibold">Assigned Tasks</div>
        <div className="relative w-80">
          <input
            name="inputQuery"
            type="text"
            value={searchQuery}
            onKeyDown={handleKeyEnter}
            onChange={(e) => {
              setClick(false);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search..."
            className="w-full h-8 pl-4 pr-10 text-sm rounded-md border-2 placeholder:text-gray-400 border-gray-400 text-gray-400 focus:outline-none focus:border-blue-500 transition duration-200 shadow-sm "
          />
          <div
            onClick={() => setClick(true)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <i className="bi bi-search text-sm text-gray-400 hover:text-black transition duration-200"></i>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
      <div className="flex flex-wrap gap-4">
        {/* The outer container uses flexbox to arrange items */}
        {filteredData.map((data, index) => (
          <div
            key={data.id}
            style={{ border: "1px solid #d3d3d3" }}
            className="bg-white relative p-5 rounded-md w-3/12 flex flex-col"
          >
            {/* Each item is a flex container with a column layout and responsive width */}
            <div className="flex gap-2 mb-2 justify-between items-center ">
              <div className="flex gap-5 justify-start items-center ">
                <div
                  className={`px-2 py-1 flex gap-2 justify-center items-center text-lg rounded-md border-black ${
                    data.column_id === 3
                      ? "bg-green-100"
                      : data.column_id === 2
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                  }`}
                >
                  <i
                    className="pi pi-tablet font-bold"
                    style={{
                      color:
                        data.column_id === 3
                          ? "#218838"
                          : data.column_id === 2
                          ? "#f9c23c"
                          : "#007bff",
                    }}
                  ></i>

                  <p
                    className="font-medium"
                    style={{ color: "#DAA520", fontWeight: "500" }}
                  >
                    {data.column_id === 1
                      ? "ToDo"
                      : data.column_id === 2
                      ? "In Progress"
                      : "Done"}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor:
                      data.priority === "Low"
                        ? "#f2e8ff"
                        : data.priority === "Medium"
                        ? "#e8ffea"
                        : "#fce1e4",
                  }}
                  className="px-3 py-1 flex gap-2 justify-center items-center text-lg rounded-md w-fit border-black"
                >
                  <i
                    className="pi pi-circle-fill font-bold"
                    style={{
                      color:
                        data.priority === "Low"
                          ? "#6a00ff"
                          : data.priority === "Medium"
                          ? "#09fc05"
                          : "#fc0522",
                      fontSize: "8px",
                    }}
                  ></i>

                  <p
                    className="font-bold"
                    style={{
                      color:
                        data.priority === "Low"
                          ? "#6a00ff"
                          : data.priority === "Medium"
                          ? "#09fc05"
                          : "#ba3451",
                      fontWeight: "600",
                    }}
                  >
                    {data.priority}
                  </p>
                </div>
              </div>

              <button
                data-dropdown-toggle="apple-imac-27-dropdown"
                onClick={(e) => {
                  handleActionClick(e, data.id);
                  getAssignedUsers(data.id);
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

              {/* <i
                // onClick={() => handleOpenEdit(data)}
                className="pi pi-ellipsis-v cursor-pointer"
                style={{ color: "#635fc7", fontSize: "15px" }}
              ></i> */}
            </div>

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
                        }}
                      >
                        View
                      </li>
                    }
                    {
                      <li
                        className="block py-1 cursor-pointer px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          handleOpenEdit(data);
                        }}
                      >
                        Edit
                      </li>
                    }
                    {
                      <li
                        className="block py-1 px-4 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          deleteTask(data.id);
                        }}
                      >
                        Delete
                      </li>
                    }
                  </>
                </ul>
              </div>
            )}

            <div
              title={data.title}
              className="text-2xl cursor-pointer font-bold mb-3 font-sm w-64 overflow-hidden whitespace-nowrap text-ellipsis "
            >
              {/* Task name displayed in bold */}
              {data.title}
            </div>
            <div
              title={data.task_desc}
              className="mb-2 cursor-pointer font-sm w-full overflow-hidden whitespace-nowrap text-ellipsis text-sm"
            >
              {data.task_desc}
            </div>
            <hr className="border-t border-gray-300 my-2" />
            <div className=" font-sm text-sm">
              {/* Due date of the task */}
              {formatDateToIST(data.due_date)}
            </div>
            {/* <div className="mb-2">
        {data.assigned_to}
      </div> */}
          </div>
        ))}
      </div>

      {isTaskModalOpen && (
        <TaskView
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          assignedUsers={assignedUsers}
          type="add"
        />
      )}

      {openEdit && editData && (
        <div className="blur-background">
          <AssignedEdit
            assignedUsers={assignedUsers}
            setAssignedUsers={setAssignedUsers}
            data={editData}
            onSubmit={onSubmit}
            setOpenEdit={setOpenEdit}
          />
        </div>
      )}
    </div>
  );
}

export default AssignedTask;
