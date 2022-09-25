import {createSlice} from '@reduxjs/toolkit'
import {emptyNotice} from "./emptyNotice";


export const displayedNoticeSlice = createSlice({
    name: 'displayedNotice',
    initialState: {
        value: emptyNotice
    },
    reducers: {
        updateDisplayedField: (state, action) => {
            state.value = {...state.value, ...action.payload}
        },
        resetDisplayedNotice: () => {
            return {
                value: emptyNotice
            }
        },
    },
})


export const {updateDisplayedField, resetDisplayedNotice} = displayedNoticeSlice.actions

export default displayedNoticeSlice.reducer