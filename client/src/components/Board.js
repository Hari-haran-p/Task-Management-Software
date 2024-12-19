import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "../styles/Board.css";
import Column from "./Column"; // Assuming the Column component is already defined
import Sidebar from "./Sidebar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AssignedTask from "./AssignedTask";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import AdminPage from "./AdminPage";

export default function Board() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [taskData, setTaskData] = useState();

  const location = useLocation();
  const currentPath = location.pathname;

  const getTaskData = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const userEmail = userDetails ? userDetails.email : null; // Extract email
      // console.log(userEmail);

      if (!userEmail) {
        console.error("User Email is not available");
        return;
      }
      const response = await axios.get(
        `http://localhost:4000/api/getTaskData?userEmail=${userEmail}`
      );
      setTaskData(response.data.results);
    } catch (e) {
      console.log("Error fetching task data", e);
    }
  };

  const [assignedData, setAssignedData] = useState();

  const getAssignedData = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const userId = userDetails ? userDetails.id : null;

      if (!userId) {
        console.error("User id is not available");
        return;
      }
      const response = await axios.get(
        `http://localhost:4000/api/getAssignedData?userId=${userId}`
      );
      setAssignedData(response.data.results);
    } catch (e) {
      console.log("Error fetching task data", e);
    }
  };
  // console.log(assignedData);
  const refresh = useSelector((state) => state.refresh);

  useEffect(() => {
    getAssignedData();
  }, [refresh]);

  useEffect(() => {
    getTaskData();
  }, [refresh]);

  console.log({ jv: taskData });

  return (
    <div
      className={isBigScreen && isSideBarOpen ? "board open-sidebar" : "board"}
    >
      {isBigScreen && (
        <Sidebar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {currentPath === "/dashboard" && (
        <div className="w-full">
          <Dashboard
          // assignedData={assignedData}
          // getAssignedData={getAssignedData}
          />
        </div>
      )}
      {/* {taskData.map((task, index) => { */}
      {/* return  */}
      {currentPath === "/mytask" && taskData && <Column taskData={taskData} />}
      {currentPath === "/assigned" && assignedData && (
        <div className="w-full">
          <AssignedTask
            assignedData={assignedData}
            getAssignedData={getAssignedData}
            getTaskData={getTaskData}
          />
        </div>
      )}
      {currentPath === "/chat" && (
        <div className="w-full">
          <Chat />
        </div>
      )}

      {currentPath === "/adduser" && (
        <div className="w-full">
          <AdminPage />
        </div>
      )}

      {/* })} */}

      {/* <div
        className="add-column-column heading-XL"
        onClick={() => {
          setIsBoardModalOpen(true)
        }}
      >
        + New Column
      </div> */}
    </div>
  );
}
