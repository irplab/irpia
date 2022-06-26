import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {sendNotice} from "./noticeAPI";


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
        value: {
            title: '',
            description: '',
            url: '',
        }
    },
    reducers: {
        updateField: (state, action) => {
            state.value = {...state.value, ...action.payload}
        },
    },

    extraReducers: {
        [submitNotice.pending](state) {
            state.pending = true;
        },
        [submitNotice.fulfilled](state, action) {
            state.pending = false;
        },
        [submitNotice.rejected](state, action) {
            state.pending = false;
            state.error = action.payload?.errors || action.error;
        },
    },
})


// Action creators are generated for each case reducer function
export const {updateField} = noticeSlice.actions

export default noticeSlice.reducer