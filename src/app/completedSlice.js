import { createSlice } from "@reduxjs/toolkit";

export const completedSlice = createSlice({
  name: "completed",
  initialState: {
    value: false
  },
  reducers: {
    setCompleted: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setCompleted } = completedSlice.actions;

export const selectCompleted = (state) => state.completed.value;

export default completedSlice.reducer;