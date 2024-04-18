/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (cursor: number) => ({
        url: `/user?take=40&cursor=${cursor}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
    deleteUserById: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),

    updateUser: builder.mutation({
      query: (user: TUpdateUser) => ({
        url: `/user`,
        method: "PATCH",
        data: { ...user },
      }),
    }),
    getUserByIdMut: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByIdMutMutation,
  useDeleteUserByIdQuery,
  useUpdateUserMutation,
} = userApiSlice;
