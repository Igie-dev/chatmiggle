/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const imageApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAvatarLink: builder.query({
			query: (id: string) => ({
				url: `/image/avatar/${id}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useGetAvatarLinkQuery } = imageApiSlice;
