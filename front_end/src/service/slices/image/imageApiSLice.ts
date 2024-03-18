/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const imageApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		uploadAvatar: builder.mutation({
			query: ({ data, id }: { data: FormData; id: string }) => ({
				url: `/image/uploadavatar/${id}`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["avatar"],
		}),

		getAvatarLink: builder.query({
			query: (id: string) => ({
				url: `/image/avatar/${id}`,
				method: "GET",
			}),
			providesTags: ["avatar"],
		}),

		deleteAvatar: builder.mutation({
			query: (id: string) => ({
				url: `/image/avatar/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["avatar"],
		}),
	}),
});

export const {
	useUploadAvatarMutation,
	useGetAvatarLinkQuery,
	useDeleteAvatarMutation,
} = imageApiSlice;
