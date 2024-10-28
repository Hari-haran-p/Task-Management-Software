import { configureStore } from "@reduxjs/toolkit";
// import boardsSlice from "./boardsSlice";
import themeSlice from "./themeSlice";
import refreshSlice from "./refreshSlice";

const store = configureStore({
  reducer: {
    // boards: boardsSlice.reducer,
    theme: themeSlice.reducer,
    refresh : refreshSlice
  }
})

export default store
