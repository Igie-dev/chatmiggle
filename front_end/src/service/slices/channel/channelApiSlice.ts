/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
const messagesLimit = import.meta.env.VITE_MESSAGES_LIMIT;
const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChannels: builder.query({
      query: ({ user_id, search }: { user_id: string; search: string }) => ({
        url: `/channel/userchannel/${user_id}${
          search ? `?search=${search}` : ""
        }`,
        method: "GET",
      }),
    }),
    verifyUserInChannel: builder.query({
      query: ({
        channel_id,
        user_id,
      }: {
        channel_id: string;
        user_id: string;
      }) => ({
        url: `/channel/verifyuser/${channel_id}/${user_id}`,
        method: "GET",
      }),
    }),
    getChannelMessages: builder.mutation({
      query: ({
        channelId,
        cursor,
      }: {
        channelId: string;
        cursor?: number | null;
      }) => ({
        url: `/channel/messages/${channelId}?take=${messagesLimit}${
          cursor ? `&cursor=${cursor}` : ""
        }`,
        method: "GET",
      }),
    }),
    getChannel: builder.query({
      query: (channelId: string) => ({
        url: `/channel/${channelId}`,
        method: "GET",
      }),
    }),
    deleteChannel: builder.mutation({
      query: ({
        channelId,
        userId,
      }: {
        channelId: string;
        userId: string;
      }) => ({
        url: `/channel/${channelId}/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserChannelsQuery,
  useVerifyUserInChannelQuery,
  useGetChannelMessagesMutation,
  useGetChannelQuery,
  useDeleteChannelMutation,
} = channelApiSlice;
