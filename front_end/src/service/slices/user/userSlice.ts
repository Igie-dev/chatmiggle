/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user_id: null,
    email: null,
    first_name: null,
    last_name: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      const { user_id, email, first_name, last_name } = action.payload;
      state.email = email;
      state.user_id = user_id;
      state.first_name = first_name;
      state.last_name = last_name;
    },
    removeCurrentUser: (state) => {
      state.email = null;
      state.user_id = null;
      state.first_name = null;
      state.last_name = null;
    },
  },
});

export const { setCurrentUser, removeCurrentUser } = userSlice.actions;
export const getCurrentUser = (state: any) => state.user;
export default userSlice.reducer;
