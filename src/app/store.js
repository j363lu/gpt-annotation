import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';
import completedReducer from './completedSlice';

export default configureStore({
  reducer: {
    progress: progressReducer,
    completed: completedReducer,
  },
})