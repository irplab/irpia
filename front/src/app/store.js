import { configureStore } from '@reduxjs/toolkit';
import suggestionsReducer from '../features/notice/suggestionsSlice';

export const store = configureStore({
  reducer: {
    suggestions: suggestionsReducer,
  },
});
