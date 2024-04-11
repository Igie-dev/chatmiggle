/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const channelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserChannels: builder.query({
            query: (user_id:string) => ({ 
                url: `/channel/userchannel/${user_id}`,
                method: "GET",
            })
        }),
        verifyUserInChannel: builder.query({
            query: ({channel_id,user_id}:{channel_id:string,user_id:string}) => ({
                url: `/channel/verifyuser/${channel_id}/${user_id}`,
                method: "GET"
            })
        }),
        getChannelMessages: builder.query({
            query: ({channelId,cursor}:{channelId:string,cursor?:string}) => ({
                url: `/channel/messages/${channelId}?take=50${cursor ? `&cursor=${cursor}` : ""}`,
                method: "GET"
            })
        }),
        getChannel: builder.query({
            query:(channelId:string) => ({
                url: `/channel/${channelId}`,
                method: "GET"
            })
        })
    })
})


export const {useGetUserChannelsQuery,useVerifyUserInChannelQuery,useGetChannelMessagesQuery,useGetChannelQuery} = channelApiSlice;