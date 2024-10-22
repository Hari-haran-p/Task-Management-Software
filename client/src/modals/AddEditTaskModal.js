import React, { useEffect, useState , useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
// import boardsSlice from "../redux/boardsSlice";
import "../styles/BoardModals.css";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { Toast } from 'primereact/toast';

export default function AddEditTaskModal({
  type,
  isTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  //   const dispatch = useDispatch();
  // const [isFirstLoad, setIsFirstLoad] = useState(true);
  // const [isValid, setIsValid] = useState(true);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  //   const board = useSelector((state) => state.boards).find(
  //     (board) => board.isActive
  //   );
  //   const columns = board.columns;
  //   const col = columns.find((col, index) => index === prevColIndex);
  //   const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];
  //   const [status, setStatus] = useState(columns[prevColIndex].name);
  // const [newColIndex, setNewColIndex] = useState(prevColIndex);
  // const [subtasks, setSubtasks] = useState([
  //   { title: "", isCompleted: false, id: uuidv4() },
  //   { title: "", isCompleted: false, id: uuidv4() },
  // ]);

  //   if (type === "edit" && isFirstLoad) {
  //     setSubtasks(
  //       task.subtasks.map((subtask) => {
  //         return { ...subtask, id: uuidv4() };
  //       })
  //     );
  //     setTitle(task.title);
  //     setDescription(task.description);
  //     setIsFirstLoad(false);
  //   }

  //   const validate = () => {
  //     setIsValid(false);
  //     if (!title.trim()) {
  //       return false;
  //     }
  //     for (let i = 0; i < subtasks.length; i++) {
  //       if (!subtasks[i].title.trim()) {
  //         return false;
  //       }
  //     }
  //     setIsValid(true);
  //     return true;
  //   };

  //   const onChangeSubtasks = (id, newValue) => {
  //     setSubtasks((prevState) => {
  //       const newState = [...prevState];
  //       const subtask = newState.find((subtask) => subtask.id === id);
  //       subtask.title = newValue;
  //       return newState;
  //     });
  //   };

  //   const onDelete = (id) => {
  //     setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  //   };

  //   const onChangeStatus = (e) => {
  //     setStatus(e.target.value);
  //     setNewColIndex(e.target.selectedIndex);
  //   };

  //   const onSubmit = (type) => {
  //     if (type === "add") {
  //       dispatch(
  //         boardsSlice.actions.addTask({
  //           title,
  //           description,
  //           subtasks,
  //           status,
  //           newColIndex,
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         boardsSlice.actions.editTask({
  //           title,
  //           description,
  //           subtasks,
  //           status,
  //           taskIndex,
  //           prevColIndex,
  //           newColIndex,
  //         })
  //       );
  //     }
  //   };

  const [levelBasedUser, setLevelBasedUser] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("userDetails"));
  const [selectedUsers, setSelectedUsers] = useState([]);
  console.log(selectedUsers.length);
  

  const [formData, setFormData] = useState({
    task_name: "",
    task_desc: "",
    priority: "",
    due_date: "",
    assigned_to: "",
    assigned_by: userDetail.id,
    status_id: "",
    task_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "due_date") {
      const localDate = new Date(value);
      // Convert local date to ensure correct handling
      localDate.setMinutes(
        localDate.getMinutes() + localDate.getTimezoneOffset()
      );
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getUserByLevel = async (level) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/getUserByLevel`,
        {
          params: { level },
        }
      );
      setLevelBasedUser(response.data.results);
    } catch (err) {
      console.log({ "error fetching getUserByLevel": err });
    }
  };

  useEffect(() => {
    if (userDetail && userDetail.level !== undefined) {
      getUserByLevel(userDetail.level);
    }
  }, []);

  const { task_name, priority, due_date, status_id, assigned_by, task_desc } =
    formData;
  const user_ids = selectedUsers.map((user) => user.id);

  const addNewTask = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/addNewTask`,
        {
          task_name: task_name,
          priority: priority,
          due_date: due_date,
          status_id: status_id,
          assigned_by: assigned_by,
          task_desc: task_desc,
          selectedUsers: user_ids,
        }
      );
      console.log(response);
    } catch (err) {
      console.log({ "error pushing NewTask": err });
    }
  };

  // Handle selection of options
  const handleSelect = (selectedList, selectedItem) => {
    setSelectedUsers(selectedList);
  };

  const handleRemove = (selectedList, removedItem) => {
    setSelectedUsers(selectedList);
  };
  
  const toast = useRef(null);

  const show = () => {
      toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content' });
  };

  return (
    <div
      className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      <form
        onSubmit={() => {
          addNewTask();
          setIsAddTaskModalOpen(false);
        }}
        className="modal"
      >
        <h3>{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <label htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            value={formData.task_name}
            onChange={handleChange}
            id="task-name-input"
            name="task_name"
            type="text"
            required
            placeholder="e.g. Take coffee break"
            // className={!isValid && !title.trim() ? "red-border" : ""}
          />
          {/* {!isValid && !title.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}  */}
        </div>

        <label htmlFor="task-name-input">Description</label>
        <div className="description-container">
          <textarea
            value={formData.task_desc}
            onChange={handleChange}
            required
            name="task_desc"
            id="task-description-input"
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>
        <label htmlFor="task-name-input">Priority</label>
        <div className="input-container">
          <select
            value={formData.priority}
            onChange={handleChange}
            name="priority"
            id="task-name-input"
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label htmlFor="task-name-input">Due Date</label>
          <div className="input-container">
            <input
              value={formData.due_date || ""} // Display formatted date or empty if not available
              onChange={handleChange}
              name="due_date"
              id="task-name-input"
              type="date"
              required
            />
          </div>

          <label htmlFor="assigned-to-input">Assigned To</label>
          <Multiselect
            required
            options={levelBasedUser} // Options from levelBasedUser data
            displayValue="email" // Display the user's email in the dropdown
            onSelect={handleSelect} // Function when an item is selected
            onRemove={handleRemove} // Function when an item is removed
            selectedValues={selectedUsers} // Keep track of selected values
            placeholder="Select users"
            style={{
              optionContainer: {
                // border: '1px solid #635fc7',
                fontSize: "12px",
              },
              chips: {
                // backgroundColor: '#635fc7',
                color: "white",
                borderRadius: "4px",
                padding: "5px",
                margin: "2px",
              },
            }}
          />
          {/* <label htmlFor="task-name-input">Assigned By</label>
          <div className="input-container">
            <input
              value={formData.assigned_by}
              // onChange={(e) => setTitle(e.target.value)}
              id="task-name-input"
              type="text"
              placeholder="e.g. Take coffee break"
              // className={!isValid && !title.trim() ? "red-border" : ""}
            />
            {!isValid && !title.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )} 
          </div> */}

          <label htmlFor="task-name-input">Status</label>
          <div className="input-container">
            <select
              value={formData.status_id}
              onChange={handleChange}
              name="status_id"
              id="task-name-input"
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="1">To Do</option>
              <option value="2">In Progress</option>
              <option value="3">Done</option>
            </select>
          </div>
          {/* {!isValid && !title.trim() && (
         <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )} */}
        </div>

        <button
          type="submit"
          // onClick={() => {

          // setIsAddTaskModalOpen(false)
          //   const isValid = validate();
          //   if (isValid) {
          //     onSubmit(type);
          // setIsAssignedEditOpen(false);
          //     type === "edit" && setIsTaskModalOpen(false);
          //   }
          // HandleSubmit();
          // }}

          className="create-btn"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
