import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';
import completedReducer from './completedSlice';
import errorReducer from './errorSlice';

export default configureStore({
  reducer: {
    progress: progressReducer,
    completed: completedReducer,
    error: errorReducer,
  },
})