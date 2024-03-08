import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,

}
export const server = "http://localhost:5000/";
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signUpStart: (state) => {

            state.error = null
        },
        signUpSuccess: (state, action) => {

            state.currentUser = action.payload
            state.error = null
        },
        signUpFailure: (state, action) => {

            state.error = action.payload
        },
        signInStart: (state) => {

            state.error = null
        },
        signInSuccess: (state, action) => {

            state.currentUser = action.payload
            state.error = null
        },
        signInFailure: (state, action) => {

            state.error = action.payload
        },
        signOutSuccess: (state) => {

            state.currentUser = null
            state.error = null
        },
        updateStart: (state) => {

            state.error = null
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;

            state.error = null;
        },
        updateFailure: (state, action) => {

            state.error = action.payload;
        },
        deleteUserStart: (state) => {

            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;

            state.error = null;
        },
        deleteUserFailure: (state, action) => {

            state.error = action.payload;
        },

    }
})

export const {
    signUpFailure,
    signUpStart,
    signUpSuccess,
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
