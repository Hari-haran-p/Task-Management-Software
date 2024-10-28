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

export default function Board() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [taskData, setTaskData] = useState();

  const location = useLocation();
  const currentPath = location.pathname;

  const getTaskData = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const userEmail = userDetails ? userDetails.email : null; // Extract email
      if (!userEmail) {
        console.error("User Email is not available");
        return;
      }
      const response = await axios.get(`http://localhost:4000/api/getTaskData?userEmail=${userEmail}`);
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
  const refresh = useSelector((state)=>state.refresh)

  useEffect(() => {
    getAssignedData();
  }, [refresh]);

  useEffect(() => {
    getTaskData();
  })

  // console.log({"jv":assignedData});
  
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

      {currentPath === "/dashboard" &&  (
        <div className="w-full">
          <Dashboard
            // assignedData={assignedData}
            // getAssignedData={getAssignedData}
          />
        </div>
      )}
      {/* {taskData.map((task, index) => { */}
      {/* return  */}
      {currentPath === '/mytask' && taskData && (
        <Column taskData={taskData} />
      )}
      {currentPath === "/assigned" && assignedData && (
        <div className="w-full">
          <AssignedTask
            assignedData={assignedData}
            getAssignedData={getAssignedData}
            getTaskData={getTaskData}
          />
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

// import React, { useState } from "react";
// // import { useSelector } from "react-redux";
// import { useMediaQuery } from "react-responsive";
// // import AddEditBoardModal from "../modals/AddEditBoardModal";
// import "../styles/Board.css";
// import Column from "./Column";
// // import EmptyBoard from "./EmptyBoard";
// import Sidebar from "./Sidebar";

// export default function Board() {
//   const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
//   const [isSideBarOpen, setIsSideBarOpen] = useState(true);
//   const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
//   // const boards = useSelector((state) => state.boards);
//   // const board = boards.find((board) => board.isActive === true);
//   const columns = ['todo', 'doing', 'done'];

//   return (
//     <div
//       className={isBigScreen && isSideBarOpen ? "board open-sidebar" : "board"}
//     >
//       {isBigScreen && (
//         <Sidebar
//           isSideBarOpen={isSideBarOpen}
//           setIsSideBarOpen={setIsSideBarOpen}
//         />
//       )}

//       {/* {columns.length > 0 ? ( */}
//         {/* <> */}
//           {columns.map((col, index) => {
//             return <Column key={index} colIndex={index} />;
//           })}
//           <div
//             className="add-column-column heading-XL"
//             onClick={() => {
//               setIsBoardModalOpen(true);
//             }}
//           >
//             + New Column
//           </div>
//         {/* </> */}
//       {/* ) : ( */}
//         {/* <EmptyBoard type="edit" /> */}
//       {/* )} */}
//       {/* {isBoardModalOpen && <AddEditBoardModal type="edit" setIsBoardModalOpen={setIsBoardModalOpen} />} */}
//     </div>
//   );
// }
