import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    errorOpen: false,
    errorMessage: "This order is not valid"
  },
  reducers: {
    setErrorOpen: (state, action) => {
      state.errorOpen = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    }
  }
});

export const { setErrorOpen, setErrorMessage } = errorSlice.actions;

export const selectErrorOpen = (state) => state.error.errorOpen;
export const selectErrorMessage = (state) => state.error.errorMessage;

export default errorSlice.reducer;