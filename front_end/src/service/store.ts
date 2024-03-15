import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux/es/exports";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { apiSlice } from "./slices/api/apiSlice";
import userReducer from "./slices/user/userSlice";
import authReducer from "./slices/auth/authSlice";
import channelReducer from "./slices/channel/channelSlice";
const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
		user: userReducer,
		channel: channelReducer,
	},
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		apiSlice.middleware,
	],
	devTools: false,
});
setupListeners(store.dispatch);

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
