/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";
const messagesLimit = import.meta.env.VITE_MESSAGES_LIMIT;
const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChannels: builder.query({
      query: ({ user_id, search }: { user_id: string; search: string }) => ({
        url: `/channel/userchannel/${user_id}${search ? `?search=${search}` : ""
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
      query: (data: TCreateNewPrivateChannel) => ({
        url: "/channel",
        method: "POST",
        body: data
      })
    }),

    createGroup: builder.mutation({
      query: (data: TCreateNewPrivateChannel) => ({
        url: "/channel/group",
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
    addToGroup: builder.mutation({
      query: (data: { channel_id: string, user_id: string }) => ({
        url: "/channel/group/add",
        method: "POST",
        body: data
      })
    }),
    removeFromGroup: builder.mutation({
      query: (data: { channel_id: string, type: string, user_id: string }) => ({
        url: "/channel/group/remove",
        method: "DELETE",
        body: data
      })
    }),
    seenChannel: builder.mutation({
      query: (data: { channel_id: string, user_id: string }) => ({
        url: "/channel/seen",
        method: "POST",
        body: data
      })
    }),
  }),
});

export const {
  useGetUserChannelsQuery,
  useGetChannelMessagesMutation,
  useGetChannelQuery,
  useDeleteChannelMutation,
  useSendMessageMutation,
  useAddToGroupMutation,
  useChangeGroupNameMutation,
  useCreateChannelMutation,
  useCreateGroupMutation,
  useRemoveFromGroupMutation,
  useSeenChannelMutation
} = channelApiSlice;
