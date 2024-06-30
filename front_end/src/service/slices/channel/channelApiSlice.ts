/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
const messagesLimit = import.meta.env.VITE_MESSAGES_LIMIT;
const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChannels: builder.query({
      query: ({ userId, search }: { userId: string; search: string }) => ({
        url: `/channel/userchannel/${userId}${search ? `?search=${search}` : ""
          }`,
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
        url: `/channel/messages/${channelId}?take=${messagesLimit}${cursor ? `&cursor=${cursor}` : ""
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
        url: `/channel/delete`,
        method: "DELETE",
        body: {
          channelId,
          userId,
        }
      }),
    }),

    sendMessage: builder.mutation({
      query: (newmessage: TSendMessage) => ({
        url: "/channel/newmessage",
        method: "POST",
        body: newmessage
      })
    }),

    createChannel: builder.mutation({
      query: (data: TCreateChannel) => ({
        url: "/channel",
        method: "POST",
        body: data
      })
    }),

    changeGroupName: builder.mutation({
      query: (data: { channelId: string, name: string, userId: string }) => ({
        url: "/channel/group/changename",
        method: "POST",
        body: data
      })
    }),

    removeFromGroup: builder.mutation({
      query: (data: { channelId: string, type: string, userId: string }) => ({
        url: "/channel/group/remove",
        method: "DELETE",
        body: data
      })
    }),

    seenChannel: builder.mutation({
      query: (data: { channelId: string, userId: string }) => ({
        url: "/channel/seen",
        method: "POST",
        body: data
      })
    }),
    requestJoinChannel: builder.mutation({
      query: (data: { channelId: string, userId: string }) => ({
        url: "/channel/requestjoin",
        method: "POST",
        body: data
      })
    }),

    getChannelMembers: builder.query({
      query: (channelId: string) => ({
        url: `/channel/getmembers/${channelId}`,
        method: "GET",
      }),
    }),
    getChannelRequestJoin: builder.query({
      query: (channelId: string) => ({
        url: `/channel/requestjoin/${channelId}`,
        method: "GET",
      }),
    }),
    acceptChannelJoinRequest: builder.mutation({
      query: (data: { channelId: string, userId: string }) => ({
        url: "/channel/acceptjoinrequest",
        method: "POST",
        body: data
      })
    }),
  }),
});
//TODO
//Make req for user request join to channel

export const {
  useGetUserChannelsQuery,
  useGetChannelMessagesMutation,
  useGetChannelQuery,
  useDeleteChannelMutation,
  useSendMessageMutation,
  useChangeGroupNameMutation,
  useCreateChannelMutation,
  useRemoveFromGroupMutation,
  useSeenChannelMutation,
  useGetChannelMembersQuery,
  useGetChannelRequestJoinQuery,
  useRequestJoinChannelMutation,
  useAcceptChannelJoinRequestMutation,
} = channelApiSlice;
