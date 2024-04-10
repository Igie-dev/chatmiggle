/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

const channelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserChannels: builder.query({
            query: (user_id:string) => ({ 
                url: `/channel/${user_id}`,
                method: "GET",
            })
        }),
        verifyUserInChannel: builder.query({
            query: ({channel_id,user_id}:{channel_id:string,user_id:string}) => ({
                url: `/channel/verifyuser/${channel_id}/${user_id}`,
                method: "GET"
            })
        })
    })
})


export const {useGetUserChannelsQuery,useVerifyUserInChannelQuery} = channelApiSlice;