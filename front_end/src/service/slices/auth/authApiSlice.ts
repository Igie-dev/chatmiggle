/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
import { setCurrentUser, removeCurrentUser } from "../user/userSlice";
import jwtDecode from "jwt-decode";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		//Login
		signIn: builder.mutation({
			query: (credintials: TLogin) => ({
				url: "/auth/signin",
				method: "POST",
				body: { ...credintials },
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
					const decoded: any = jwtDecode(accessToken);
					const { user_id, email, first_name, last_name } = decoded.User;
					if (user_id && email && first_name && last_name) {
						dispatch(setCurrentUser({ user_id, email, first_name, last_name }));
					}
				} catch (error) {
					console.log(error);
				}
			},
		}),

		//logout
		signOut: builder.mutation({
			query: () => ({
				url: "/auth/signout",
				method: "GET",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const res = await queryFulfilled;
					if (res?.data) {
						dispatch(logOut());
						dispatch(removeCurrentUser());
					}
				} catch (error) {
					console.log(error);
				}
			},
		}),

		//Refresh
		refresh: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
					const decoded: any = jwtDecode(accessToken);
					const { user_id, email, first_name, last_name } = decoded.User;
					if (user_id && email && first_name && last_name) {
						dispatch(setCurrentUser({ user_id, email, first_name, last_name }));
					}
				} catch (error) {
					console.log(error);
				}
			},
		}),

		//Register
		requestVerifyEmail: builder.mutation({
			query: (email: string) => ({
				url: "/register/getotp",
				method: "POST",
				body: { email },
			}),
		}),

		register: builder.mutation({
			query: (credintials: TRegister) => ({
				url: "/register",
				method: "POST",
				body: { ...credintials },
			}),
		}),
	}),
});

export const {
	useSignOutMutation,
	useRefreshMutation,
	useSignInMutation,
	useRegisterMutation,
	useRequestVerifyEmailMutation,
} = authApiSlice;