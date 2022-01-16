import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchSuggestions} from './noticeAPI';

const initialState = {
    suggestions: {},
    status: 'idle',
};
export const assist = createAsyncThunk(
    'suggestions/fetchSuggestions',
    async (notice, {rejectWithValue}) => {
        try {
            console.log(process.env)
            const response = await fetchSuggestions(notice);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);


export const suggestionsSlice = createSlice({
    name: 'notice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(assist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(assist.fulfilled, (state, action) => {
                state.status = 'idle';
                state.suggestions = action.payload.suggestions;
            });
    },
});

export const selectSuggestions = (state) => state.suggestions;

export default suggestionsSlice.reducer;
