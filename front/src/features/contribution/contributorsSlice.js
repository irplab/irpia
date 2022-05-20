import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';

const initialState = {
    publishers: []
}


export const contributorsSlice = createSlice({
    name: 'contributors',
    initialState,
    reducers: {
        setContributor: (state, action) => {
            state.publishers = [action.payload.publisher]
        },
    },
});

export const selectContributors = (state) => state.contributors;
// Action creators are generated for each case reducer function
export const {setContributor} = contributorsSlice.actions
export default contributorsSlice.reducer;
