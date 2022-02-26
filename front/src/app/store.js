import {configureStore} from '@reduxjs/toolkit';
import suggestionsReducer from '../features/notice/suggestionsSlice';
import vocabulariesReducer from '../features/notice/vocabulariesSlice';

export const store = configureStore({
    reducer: {
        suggestions: suggestionsReducer,
        vocabularies: vocabulariesReducer,
    },
});
