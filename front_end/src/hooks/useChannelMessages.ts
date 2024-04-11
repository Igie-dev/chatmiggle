import { useGetChannelMessagesQuery } from '@/service/slices/channel/channelApiSlice';
import { useMemo, useState } from 'react'

export default function useChannelMessages(channelId:string) {
  const [cursor, setCursor] = useState("");
  const { data, isFetching, isError,refetch } = useGetChannelMessagesQuery({
    channelId: channelId as string, cursor
  });

  const messages  = useMemo(():TMessageData[] => {
       let messagesData:TMessageData[] = [];
        if(data?.messages && data?.messages?.length >= 1){
            if(data?.messages?.length >= 100){
            const lastMessage = data.messages[0]?.id;
           console.log(lastMessage)
           setCursor(lastMessage);  
    
            }
           messagesData = data?.messages;
        }

        return messagesData
  },[data])
  return {messages,isFetching, isError,refetch}
}
