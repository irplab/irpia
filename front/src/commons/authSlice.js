import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {sendAuth} from "./authAPI";


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

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: {login: "", password: "", token: ""}
    },
    reducers: {
        setAuth: (state, action) => {
            state.value = {...state.value, ...action.payload}
        },
        resetAuth: () => {
            return {
                value: {login: "", password: "", token: ""}
            }
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


export const {setAuth, resetAuth} = authSlice.actions

export default authSlice.reducer