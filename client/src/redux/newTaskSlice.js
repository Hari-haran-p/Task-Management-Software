const { createSlice } = require("@reduxjs/toolkit");

const initialState =  {
    task_name: "",
    task_desc: "",
    priority: "Low",
    due_date: null,
    status_id: 1
}
const newTaskSlice = createSlice({
    name: "newTask",
    initialState,
    reducers: {
        setTask: (state, action) => {
            state[action.payload.field] = action.payload.value;
        },
        resetTask: (state, action) => {
            state.task_name = "";
            state.task_desc = "";
            state.priority = "Low";
            state.due_date = null;
            state.status_id = 1;
        }
    },
})

export const { setTask,resetTask } = newTaskSlice.actions;
export default newTaskSlice.reducer;