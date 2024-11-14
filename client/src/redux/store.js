import { configureStore } from "@reduxjs/toolkit";
// import boardsSlice from "./boardsSlice";
import themeSlice from "./themeSlice";
import refreshSlice from "./refreshSlice";
import newTaskSlice from './newTaskSlice';

const store = configureStore({
  reducer: {
    tasks: newTaskSlice,
    theme: themeSlice.reducer,
    refresh: refreshSlice
  }
});


export default store
