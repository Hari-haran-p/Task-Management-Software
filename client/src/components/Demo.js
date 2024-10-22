import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
function Demo() {
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = (event, userId) => {
    event.stopPropagation();
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(null);
    }
  };

  useEffect(() => {
    // if (isLoading != false) {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    // }
}, []);


  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={selectedCities}
        onChange={(e) => setSelectedCities(e.value)}
        options={cities}
        optionLabel="name"
        filter
        placeholder="Select Cities"
        maxSelectedLabels={3}
        className="w-full md:w-20rem"
      />

      {/* <td className=" relative px-4 py-3 flex items-center "> */}
      <button
        data-dropdown-toggle="apple-imac-27-dropdown"
        onClick={(e) => handleActionClick(e, 1)}
        className={`inline-flex items-center p-0.5 text-sm font-medium text-center ${
          dropdownVisible === 1 ? "border" : ""
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
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className="absolute top-20 right-20  w-32 dropdown-content visible z-40 bg-white dark:bg-gray-800 shadow-md rounded-lg"
        >
          <ul
            className="py-1 px-1 text-sm text-gray-700 dark:text-gray-200 "
            aria-labelledby="apple-imac-27-dropdown-button"
          >
            <>dv df dfgd</>
          </ul>
        </div>
      )}
      {/* </td> */}
    </div>
  );
}

export default Demo;
