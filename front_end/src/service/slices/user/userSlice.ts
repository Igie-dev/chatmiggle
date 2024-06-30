/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    email: null,
    firstName: null,
    lastName: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      const { userId, email, firstName, lastName } = action.payload;
      state.email = email;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
    },
    removeCurrentUser: (state) => {
      state.email = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
    },
  },
});

export const { setCurrentUser, removeCurrentUser } = userSlice.actions;
export const getCurrentUser = (state: any) => state.user;
export default userSlice.reducer;
