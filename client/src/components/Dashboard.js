import React from "react";
import { RiBillLine, RiCompassDiscoverLine } from "react-icons/ri";
import { PiTargetBold } from "react-icons/pi";
import { LuCalendarClock } from "react-icons/lu";
import { GrCompliance } from "react-icons/gr";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { CustomerService } from './service/CustomerService';
export default function Dashboard() {
  const [customers, setCustomers] = useState([ {
    name: "John Doe",
    country: { name: "USA" },
    company: "ABC Corp",
    representative: { name: "Jane Smith" },
  },
  {
    name: "Anna Johnson",
    country: { name: "Canada" },
    company: "XYZ Ltd",
    representative: { name: "Paul Brown" },
  },
  {
    name: "Mike Davis",
    country: { name: "UK" },
    company: "Tech Solutions",
    representative: { name: "Alice White" },
  },
  {
    name: "John Doe",
    country: { name: "USA" },
    company: "ABC Corp",
    representative: { name: "Jane Smith" },
  },
  {
    name: "Anna Johnson",
    country: { name: "Canada" },
    company: "XYZ Ltd",
    representative: { name: "Paul Brown" },
  },
  {
    name: "Mike Davis",
    country: { name: "UK" },
    company: "Tech Solutions",
    representative: { name: "Alice White" },
  },{
    name: "John Doe",
    country: { name: "USA" },
    company: "ABC Corp",
    representative: { name: "Jane Smith" },
  },
  {
    name: "Anna Johnson",
    country: { name: "Canada" },
    company: "XYZ Ltd",
    representative: { name: "Paul Brown" },
  },
  {
    name: "Mike Davis",
    country: { name: "UK" },
    company: "Tech Solutions",
    representative: { name: "Alice White" },
  }]);
   

  // co//nst paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" text />;

  // useEffect(() => {
  //   CustomerService.getCustomersMedium().then((data) => setCustomers(data));
  // }, []);

  return (
    <div className="">
      Dashboards
      <div className="pt-5 flex gap-4 flex-wrap justify-around mx-5">
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-9 pl-10">
          <RiBillLine style={{ color: "#635fc7" }} className="h-12  w-12 " />
          <div className="text-xl flex flex-col items-center">
            <div>Total</div>
            <div>35</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-9 pl-10">
          <PiTargetBold style={{ color: "#635fc7" }} className="h-12  w-12" />
          <div className="text-xl flex flex-col items-center">
            <div>Today</div>
            <div className="">2</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-8 pl-8">
          <LuCalendarClock
            style={{ color: "#635fc7" }}
            className="h-12  w-12"
          />
          <div className="text-xl flex flex-col items-center">
            <div>Pending</div>
            <div className="">5</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-6 pl-6">
          <GrCompliance style={{ color: "#635fc7" }} className="h-12  w-12" />
          <div className="text-xl flex flex-col items-center">
            <div>completed</div>
            <div className="">120</div>
          </div>
        </div>
        <div className="h-32 border-2 border-gray-200 w-56 rounded-xl shadow-lg flex items-center gap-7 pl-8">
          <RiCompassDiscoverLine
            style={{ color: "#635fc7" }}
            className="h-12 text-   w-12"
          />
          <div className="text-xl flex flex-col items-center">
            <div>Overdue</div>
            <div className="">500</div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-between mx-4 rounded-xl">
        <div className="card md:w-1/2 w-full overflow-x-auto rounded-xl pr-3">
          <DataTable className="rounded-lg"
            value={customers}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "38rem"}}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            paginatorClassName="rounded-b-xl "
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
           
           // paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
          >
            <Column field="name" header="Name" style={{ width: "20%",paddingLeft : "15px" }}>
            
            </Column>
            <Column
              field="country.name"
              header="Country"
              style={{ width: "20%"}}
            ></Column>
            <Column
              field="company"
              header="Company"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="representative.name"
              header="Representative"
              style={{ width: "25%" }}
              
            ></Column>
          </DataTable>
        </div>
        <div className="card md:w-1/2 w-full overflow-x-auto pl-3 rounded-xl">
          <DataTable 
          
            value={customers}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "38rem" }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            paginatorClassName="rounded-b-xl"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            className="rounded-xl "
           // paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
          >
            <Column field="name" header="Name" style={{ width: "25%" ,paddingLeft : "15px"}}>
              {" "}
              vabthet sdhhbdjknh{" "}
            </Column>
            <Column
              field="country.name"
              header="Country"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="company"
              header="Company"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="representative.name"
              header="Representative"
              style={{ width: "25%" }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
