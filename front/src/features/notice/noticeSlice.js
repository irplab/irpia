import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {sendNotice} from "./noticeAPI";
import {emptyNotice} from "./emptyNotice";


export const submitNotice = createAsyncThunk(
    'notice/submitNotice',
    async (notice, {rejectWithValue}) => {
        try {
            const response = await sendNotice(notice);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);

export const noticeSlice = createSlice({
    name: 'notice',
    initialState: {
        value: emptyNotice
    },
    reducers: {
        updateField: (state, action) => {
            state.value = {...state.value, ...action.payload}
        },
        resetNotice: () => {
            return {
                value: emptyNotice
            }
        },
    },

    extraReducers: {
        [submitNotice.pending](state) {
            state.pending = true;
        },
        [submitNotice.fulfilled](state) {
            state.pending = false;
        },
        [submitNotice.rejected](state, action) {
            state.pending = false;
            state.error = action.payload?.errors || action.error;
        },
    },
})


export const {updateField, resetNotice} = noticeSlice.actions

export default noticeSlice.reducer