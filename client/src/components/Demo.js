import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "../styles/Demo.css";
function Demo() {
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  return (
    <div className="card flex justify-content-center">
      {/* <MultiSelect
        value={selectedCities}
        onChange={(e) => setSelectedCities(e.value)}
        options={cities}
        optionLabel="name"
        filter
        placeholder="Select Cities"
        maxSelectedLabels={3}
        className="w-full md:w-20rem"
      /> */}
      <section className="flex flex-wrap outter_container">
        <main className="card_container">
          <div className="info_container">
            <span className="domain_status ENCOURS"> In Progress </span>
            <p className="title"> Card Title </p>
            <p className="description"> Description </p>
            <p> ★★★☆☆ </p>
          </div>

          <section className="actions_cnt">
            <svg
              className="menu"
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4ZM15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5ZM12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                  fill="#8e8080"
                ></path>
              </g>
            </svg>

            <div className="actions">
              <span style={{ color: "red" }}>Delete</span>
              <span style={{ color: "rgb(4, 204, 4)" }}>Update</span>
            </div>
            <p className="date"> 09-10-2024 </p>
          </section>

          <div className="view_task_overlay"></div>
          <div className="left_overlay ENCOURS">
            <svg
              // onClick={toggle_active_info}
              className="plus_info_svg"
              fill="#ffffff"
              width="30px"
              height="30px"
              viewBox="0 0 36 36"
              version="1.1"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              stroke="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z"
                  className="clr-i-outline clr-i-outline-path-1"
                ></path>
                <path
                  d="M9,14H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-2"
                ></path>
                <path
                  d="M9,18H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-3"
                ></path>
                <path
                  d="M9,22H19a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-4"
                ></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
              </g>
            </svg>
          </div>

          <div className="all_info">
            <h3 className="title_all"> All Info </h3>
            <p>
              Description : <span className="info_value"> Description </span>{" "}
            </p>
            <p>
              Programme : <span className="info_value"> Programme </span>{" "}
            </p>
            <p>
              Projet : <span className="info_value"> Projet </span>{" "}
            </p>
            <p>
              Date de Creation :{" "}
              <span className="info_value"> 09-10-2024 </span>{" "}
            </p>
            <p>
              Statut : <span className="info_value"> Status</span>{" "}
            </p>
            <p>
              Criticité : <span className="info_value"> ★★★☆☆ </span>{" "}
            </p>
            <p>
              Impact : <span className="info_value"> Impact </span>{" "}
            </p>
          </div>
        </main>

        {/* Another card container */}
        <main className="card_container">
          <section className="info_container">
            <span className="domain_status CLOTURER"> Done </span>
            <p className="title"> Card Title </p>
            <p className="description"> Description </p>
            <p> ★★★☆☆ </p>
          </section>

          <section className="actions_cnt">
            <svg
              className="menu"
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4ZM15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5ZM12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                  fill="#8e8080"
                ></path>
              </g>
            </svg>

            <div className="actions">
              <span style={{ color: "red" }}>Delete</span>
              <span style={{ color: "rgb(4, 204, 4)" }}>Update</span>
            </div>
            <p className="date"> 09-10-2024 </p>
          </section>

          <div className="view_task_overlay"></div>
          <div className="left_overlay CLOTURER">
            <svg
              // onClick={toggle_active_info}
              className="plus_info_svg"
              fill="#ffffff"
              width="30px"
              height="30px"
              viewBox="0 0 36 36"
              version="1.1"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              stroke="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z"
                  className="clr-i-outline clr-i-outline-path-1"
                ></path>
                <path
                  d="M9,14H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-2"
                ></path>
                <path
                  d="M9,18H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-3"
                ></path>
                <path
                  d="M9,22H19a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z"
                  className="clr-i-outline clr-i-outline-path-4"
                ></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
              </g>
            </svg>
          </div>

          <div className="all_info">
            <h3 className="title_all"> All Info </h3>
            <p>
              Description : <span className="info_value"> Description </span>{" "}
            </p>
            <p>
              Programme : <span className="info_value"> Programme </span>{" "}
            </p>
            <p>
              Projet : <span className="info_value"> Projet </span>{" "}
            </p>
            <p>
              Date de Creation :{" "}
              <span className="info_value"> 09-10-2024 </span>{" "}
            </p>
            <p>
              Statut : <span className="info_value"> Status</span>{" "}
            </p>
            <p>
              Criticité : <span className="info_value"> ★★★☆☆ </span>{" "}
            </p>
            <p>
              Impact : <span className="info_value"> Impact </span>{" "}
            </p>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Demo;
