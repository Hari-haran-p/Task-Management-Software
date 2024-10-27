import React, { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/logo-mobile.svg";
import addTaskMobile from "../assets/icon-add-task-mobile.svg";
import iconDown from "../assets/icon-chevron-down.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropdown from "./HeaderDropdown";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import { useMediaQuery } from "react-responsive";

export default function Header() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    // setIsElipsisMenuOpen(false);
    // setBoardType("add");
  };

  // const setOpenEditModal = () => {
  //   setIsBoardModalOpen(true);
  //   setIsElipsisMenuOpen(false);
  // };
  // const setOpenDeleteModal = () => {
  //   setIsDeleteModalOpen(true);
  //   setIsElipsisMenuOpen(false);
  // };

  // const onDeleteBtnClick = (e) => {
  //   if (e.target.textContent === "Delete") {
  //     // dispatch(boardsSlice.actions.deleteBoard());
  //     // dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  //     setIsDeleteModalOpen(false);
  //   } else {
  //     setIsDeleteModalOpen(false);
  //   }
  // };



  return (
    <div className="header-container">
      <header>
        <div className="logo-container">
          <img className="logo" src={logo} alt="logo" />
          {isBigScreen && <h3 className="logo-text">Taskly</h3>}{" "}
        </div>

        <div className="header-name-container heading-L">
          <h3 className="header-name">Manage Task</h3>
          {!isBigScreen && (
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown opened/closed"
              onClick={() => {
                onDropdownClick();
              }}
            />
          )}
        </div>
        <button
          className={`add-task-btn heading-M ${5 === 0 && "btn-off"}`}
          onClick={() => {
            setIsTaskModalOpen(true);
            // setIsElipsisMenuOpen(false);
          }}
          disabled={5 === 0}
        >
          {isBigScreen ? (
            "+ Add New Task"
          ) : (
            <img src={addTaskMobile} alt="add task" />   
          )}
        </button>
        <img
          onClick={() => {
            // setIsElipsisMenuOpen((prevState) => !prevState);
            // setBoardType("edit");
          }}
          className="elipsis"
          src={elipsis}
          alt="menu for deleting or editing board"
        />

        {openDropdown && !isBigScreen && (
          <HeaderDropdown
            setOpenDropdown={setOpenDropdown}
            // setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
        {/* {isElipsisMenuOpen && (
          <ElipsisMenu
            setOpenEditModal={setOpenEditModal}
            setOpenDeleteModal={setOpenDeleteModal}
            type="board"
          />
        )} */}
      </header>
      {/* {isBoardModalOpen && (
        <AddEditBoardModal
          type={boardType}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )} */}
      {/* {isDeleteModalOpen && (
        <DeleteModal
          type="board"
          title={board.name}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )} */}
      {isTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          type="add"

        />
      )}
    </div>
  );
}
