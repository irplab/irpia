import {configureStore} from '@reduxjs/toolkit';
import suggestionsReducer from '../features/notice/suggestionsSlice';
import vocabulariesReducer from '../features/notice/vocabulariesSlice';
import contributorsReducer from '../features/contribution/contributorsSlice';
import noticeReducer from '../features/notice/noticeSlice';

export const store = configureStore({
    reducer: {
        suggestions: suggestionsReducer,
        vocabularies: vocabulariesReducer,
        contributors: contributorsReducer,
        notice: noticeReducer,
    },
});
