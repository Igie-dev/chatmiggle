import { useGetChannelMessagesQuery } from "@/service/slices/channel/channelApiSlice";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
export default function useChannelMessages(channelId: string) {
  const [messages, setMessages] = useState<TMessageData[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const { data, isFetching, isError, refetch } = useGetChannelMessagesQuery({
    channelId: channelId as string,
    cursor,
  });

  //TODO Fix here data not change when changing channel
  //Join to socket
  useEffect(() => {
    if (channelId) {
      socket.emit("active_channel", channelId);
    }
    return () => {
      socket.off("active_channel");
    };
  }, [channelId]);

  //Handle data from api request
  useEffect(() => {
    if (data?.messages && data?.messages?.length >= 1) {
      const messages = data?.messages as TMessageData[];
      if (data?.messages[0].channel_id !== channelId) {
        setMessages([]);
      } else {
        setMessages((prev) => [...messages, ...prev]);
      }
    } else {
      setMessages([]);
    }
  }, [data, channelId]);

  //Handle data from socket
  useEffect(() => {
    socket.on("new_message", (res) => {
      if (res?.data?.channel_id === channelId) {
        setMessages((prev: TMessageData[]) => [...prev, res.data]);
      }
    });
    return () => {
      socket.off("new_message");
    };
  }, [channelId]);

  //Clear messages and cursor when closing or changing channel
  useEffect(() => {
    // Clear messages when the component unmounts or when the channelId changes
    return () => {
      setMessages([]);
      setCursor(null);
    };
  }, []);

  return {
    messages,
    isFetching,
    isError,
    setCursor,
    dataCursor: data?.cursor,
    refetch,
  };
}
