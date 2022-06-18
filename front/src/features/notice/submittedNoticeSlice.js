import {createSlice} from '@reduxjs/toolkit'

export const submittedNoticeSlice = createSlice({
    name: 'submittedNotice',
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
})


// Action creators are generated for each case reducer function
export const {updateField} = submittedNoticeSlice.actions

export default submittedNoticeSlice.reducer