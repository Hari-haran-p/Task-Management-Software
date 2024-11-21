import React from "react";
import { Link, useLocation } from "react-router-dom";
import boardIcon from "../assets/icon-board.svg";
import darkIcon from "../assets/icon-dark-theme.svg";
import lightIcon from "../assets/icon-light-theme.svg";
import { useDispatch, useSelector } from "react-redux";
import themeSlice from "../redux/themeSlice";

export default function HeaderDropdown({ setOpenDropdown, setIsBoardModalOpen }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const location = useLocation(); // Get current route

  // Function to determine if the route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="dropdown-container"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      <div className="dropdown-modal">
        <h3>ALL BOARDS </h3>
        <div className="dropdown-boards">
          
          {/* My Task nav item */}
          <div
            className={`dropdown-board dropdown-create-board-btn ${isActive("/mytask") ? "board-active" : ""}`}  // Apply active class conditionally
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown && setOpenDropdown((state) => !state);
            }}
          >
            <img className="filter-purple" alt="board" src={boardIcon} />
            <Link to="/mytask">My Task</Link>
          </div>

          {/* Dashboard nav item */}
          <div
            className={`dropdown-board dropdown-create-board-btn ${isActive("/dashboard") ? "board-active" : ""}`} // Check if Dashboard route is active
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown && setOpenDropdown((state) => !state);
            }}
          >
            <img className="filter-purple" alt="board" src={boardIcon} />
            <Link to="/dashboard">Dashboard</Link>
          </div>

          {/* Assigned Task nav item */}
          <div
            className={`dropdown-board dropdown-create-board-btn ${isActive("/assigned") ? "board-active" : ""}`} // Check if Assigned Task route is active
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown && setOpenDropdown((state) => !state);
            }}
          >
            <img className="filter-purple" alt="board" src={boardIcon} />
            <Link to="/assigned">Assigned Task</Link>
          </div>
        </div>

        {/* Theme Toggle */}
        {/* <div className="theme-toggle">
          <img src={lightIcon} alt="sun indicating light mode" />
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => dispatch(themeSlice.actions.toggleTheme())}
            />
            <span className="slider round"></span>
          </label>
          <img src={darkIcon} alt="moon indicating dark mode" />
        </div> */}
      </div>
    </div>
  );
}
