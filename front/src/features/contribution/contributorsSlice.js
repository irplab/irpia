import {createSlice} from '@reduxjs/toolkit';

const initialState = {list: [], count: 0}

const setEditedState = (state, editedId) => {
    state.list = state.list.map((contributor) => {
        return {...contributor, edited: contributor.id === editedId}
    })
}

export const contributorsSlice = createSlice({
    name: 'contributors', initialState, reducers: {
        updateContributorById: (state, action) => {
            const {id} = action.payload.contributor;
            const {list} = state;
            const index = list.findIndex(object => object.id === id);
            if (index === -1) {
                console.log("Missing contributor nr" + index);
                return;
            }
            state.list = list.map((contributor) => contributor.id === id ? action.payload.contributor : contributor)
            if (action.payload.contributor.edited) setEditedState(state, action.payload.contributor.id);
        }, deleteContributorById: (state, action) => {
            const {id} = action.payload.contributor;
            const {list} = state;
            const index = list.findIndex(object => object.id === id);
            if (index === -1) {
                console.log("Missing contributor nr" + index);
                return;
            }
            state.list.splice(index, 1);
        }, createContributor: (state) => {
            state.list = state.list.concat({
                id: state.count,
                contributorName: '',
                contributorEditorialBrand: '',
                contributorPhoneNumber: '',
                selectedSirenInfo: null,
                selectedIsniInfo: null,
                customIsni: undefined,
                customSiren: undefined,
                contributorRole: null,
                contributorRoleLabel: '',
                edited: true,
            })
            setEditedState(state, state.count);
            state.count += 1
        }, resetContributors: () => {
            return {
                ...initialState
            }
        },
    },
});

export const selectContributors = (state) => state.contributors;

export const selectContributorById = (state, contributorId) => {
    return state.contributors.list.find(contributor => contributor.id === contributorId);
}

export const {
    updateContributorById,
    deleteContributorById,
    createContributor,
    resetContributors
} = contributorsSlice.actions
export default contributorsSlice.reducer;
