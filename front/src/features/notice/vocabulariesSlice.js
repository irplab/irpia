import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {createSuggestion, fetchSuggestion} from './noticeAPI';
import {fetchVocabulary} from "./vocabularyAPI";

export const fetchVocabularyById = createAsyncThunk(
    'vocabularies/fetchVocabulary',
    async (vocabularyId, {rejectWithValue}) => {
        try {
            const response = await fetchVocabulary(vocabularyId);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);

export const vocabulariesAdapter = createEntityAdapter();


export const vocabulariesSlice = createSlice({
    name: 'vocabularies',
    initialState: vocabulariesAdapter.getInitialState({pending: false, meta: {}, error: null}),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchVocabularyById.fulfilled, (state, action) => {
            state.status = 'idle';
            vocabulariesAdapter.setOne(state, action.payload);
        });
    },
});

export const selectVocabularies = (state) => state.vocabularies;

export default vocabulariesSlice.reducer;
