import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {createSuggestion, fetchSuggestion} from './suggestionAPI';


export const initSuggestion = createAsyncThunk(
    'suggestions/createSuggestion',
    async (notice, {rejectWithValue}) => {
        try {
            const response = await createSuggestion(notice);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);
export const pollSuggestionById = createAsyncThunk(
    'suggestions/fetchSuggestion',
    async ({suggestionId, suggestionTimeStamp}, {rejectWithValue}) => {
        try {
            const response = await fetchSuggestion(suggestionId, suggestionTimeStamp);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);

export const suggestionsAdapter = createEntityAdapter();


export const suggestionsSlice = createSlice({
    name: 'suggestions',
    initialState: suggestionsAdapter.getInitialState({pending: false, meta: {}, error: null}),
    reducers: {
        resetSuggestions: () => {
            return suggestionsAdapter.getInitialState({pending: false, meta: {}, error: null});
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initSuggestion.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(initSuggestion.fulfilled, (state) => {
                state.status = 'idle';
            }).addCase(pollSuggestionById.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(pollSuggestionById.fulfilled, (state, action) => {
                state.status = 'idle';
                suggestionsAdapter.setOne(state, action.payload);
            });
    },
});

export const selectSuggestions = (state) => state.suggestions;

export const suggestionsSelectors = suggestionsAdapter.getSelectors();

export const {resetSuggestions} = suggestionsSlice.actions

export default suggestionsSlice.reducer;
