import React from "react";
import { RiBillLine, RiCompassDiscoverLine } from "react-icons/ri";
import { PiTargetBold } from "react-icons/pi";
import { LuCalendarClock } from "react-icons/lu";
import { GrCompliance } from "react-icons/gr";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState([]);

  const getDashboardData = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const userEmail = userDetails ? userDetails.email : null;
      
      if (!userEmail) {
        console.error("User Email is not available");
        return;
      }
      const response = await axios.get(`http://localhost:4000/api/getTaskData?userEmail=${userEmail}`);
      setData(response.data.results);
    } catch (e) {
      console.log("Error fetching task data", e);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);
  
  function formatDateToIST(date) {
    const localDate = new Date(date);
    localDate.setMinutes(
      localDate.getMinutes() + localDate.getTimezoneOffset() + 330
    ); // Adding 330 minutes for IST
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const totalTaskCount = data.length || 0;
  const totalTodayCount = data.filter(task => new Date(task.due_date).toDateString() === new Date().toDateString()).length || 0;
  const totalPendingCount = data.filter(task => task.status_id === 1).length || 0;
  const totalCompletedCount = data.filter(task => task.status_id === 3).length || 0;
  const overDue = data.filter(task => new Date(task.due_date) < new Date());


  return (
    <div>
      <div className="pt-5 flex gap-4 flex-wrap justify-around mx-5">
        {/* Dashboard summary cards */}
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-9 pl-10">
          <RiBillLine style={{ color: "#635fc7" }} className="h-12  w-12 " />
          <div className="text-xl flex flex-col items-center">
            <div>Total</div>
            <div>{totalTaskCount}</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-9 pl-10">
          <PiTargetBold style={{ color: "#635fc7" }} className="h-12  w-12" />
          <div className="text-xl flex flex-col items-center">
            <div>Today</div>
            <div>{totalTodayCount}</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-8 pl-8">
          <LuCalendarClock style={{ color: "#635fc7" }} className="h-12  w-12" />
          <div className="text-xl flex flex-col items-center">
            <div>Pending</div>
            <div>{totalPendingCount}</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-6 pl-6">
          <GrCompliance style={{ color: "#635fc7" }} className="h-12  w-12" />
          <div className="text-xl flex flex-col items-center">
            <div>Completed</div>
            <div>{totalCompletedCount}</div>
          </div>
        </div>
      </div>
      
      {/* Overdue Tasks Table */}
      <div className="mt-10 flex flex-wrap justify-center mx-4 rounded-xl">
        <div className="card w-11/12 overflow-x-auto rounded-xl pr-3">
          <DataTable
            value={overDue}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "38rem" }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            paginatorClassName="rounded-b-xl"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            className="rounded-lg"
          >
            <Column field="task_name" header="Name" style={{ width: "20%", paddingLeft: "15px" }} />
            <Column field="task_desc" header="Description" style={{ width: "20%" }} />
            <Column field="assigned_to" header="Assgined To" style={{ width: "25%" }} />
            <Column field="assigned_by" header="Assigned By" style={{ width: "25%" }} />
            <Column field="formattedDate" header="Due Date" style={{ width: "25%" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
}
