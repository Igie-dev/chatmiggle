import { useGetChannelMessagesQuery } from "@/service/slices/channel/channelApiSlice";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
export default function useChannelMessages(channelId: string) {
  const [messages, setMessages] = useState<TMessageData[]>([]);
  const [cursor, setCursor] = useState("");
  const { data, isFetching, isError, refetch } = useGetChannelMessagesQuery({
    channelId: channelId as string,
    cursor,
  });

  //*TODO Fix this handle refetch

  useEffect(() => {
    if (channelId) {
      socket.emit("active_channel", channelId);
    }
    return () => {
      socket.off("active_channel");
    };
  }, [channelId]);

  useEffect(() => {
    if (data?.messages && data?.messages?.length >= 1) {
      const messages = data?.messages as TMessageData[];
      setMessages((prev: TMessageData[]) => {
        if (prev[0]?.channel_id !== channelId) {
          return messages;
        } else {
          return [...messages, ...prev];
        }
      });
    } else {
      setMessages([]);
    }
  }, [data, channelId]);

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

  useEffect(() => {
    // Clear messages when the component unmounts or when the channelId changes
    return () => {
      setMessages([]);
    };
  }, []);

  return { messages, isFetching, isError, setCursor, refetch };
}
