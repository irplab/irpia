import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {sendAuth, sendLogout} from "./authAPI";


export const submitAuth = createAsyncThunk(
    'auth/submitAuth',
    async ({login, password}, {rejectWithValue}) => {
        try {
            const response = await sendAuth(login, password);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);
export const logoutRequest = createAsyncThunk(
    'auth/logoutRequest',
    async (_, {rejectWithValue}) => {
        try {
            const response = await sendLogout();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: {loggedIn: false}
    },
    reducers: {
        login: (state) => {
            state.value = {loggedIn: true}
        },
        logout: (state) => {
            state.value = {loggedIn: false}
        },
    },

    extraReducers: {
        [submitAuth.pending](state) {
            state.pending = true;
        },
        [submitAuth.fulfilled](state) {
            state.pending = false;
        },
        [submitAuth.rejected](state, action) {
            state.pending = false;
            state.error = action.payload?.errors || action.error;
        },
    },
})


export const {login, logout} = authSlice.actions

export default authSlice.reducer