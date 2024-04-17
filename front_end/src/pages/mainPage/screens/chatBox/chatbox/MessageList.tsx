import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import MessageCard from "./MessageCard";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useGetChannelMessagesMutation } from "@/service/slices/channel/channelApiSlice";
export default function MessageList() {
  const { channelId } = useParams();
  const [messages, setMessages] = useState<TMessageData[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [getMessages, { isError, isLoading }] = useGetChannelMessagesMutation();
  const [targetScroll, setTargetScroll] = useState("");
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
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getMessages({ channelId: channelId as string });
        if (res?.data && res?.data?.messages?.length >= 1) {
          if (res?.data?.messages[0]?.channel_id === channelId) {
            const messages = res?.data?.messages as TMessageData[];
            setMessages(messages);
            if (res?.data?.cursor) {
              setCursor(res?.data?.cursor);
              setTargetScroll(messages[messages.length - 1]?.message_id);
            }
          } else {
            setMessages([]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      setMessages([]);
      setCursor(null);
      setTargetScroll("");
    };
  }, [getMessages, channelId]);

  useEffect(() => {
    //handle scroll to bottom
    if (targetScroll) {
      const targetEl = document.getElementById(targetScroll) as HTMLElement;
      targetEl?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [targetScroll]);

  //Handle data from socket
  useEffect(() => {
    socket.on("new_message", (res: { data: TChannelData }) => {
      const newMessage = res?.data.messages[0] as TMessageData;
      if (res?.data?.channel_id === channelId) {
        setMessages((prev: TMessageData[]) => [...prev, newMessage]);
        setTargetScroll(newMessage?.message_id);
      }
    });
    return () => {
      socket.off("new_message");
    };
  }, [channelId]);

  const handleGetMoreMessage = () => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getMessages({
          channelId: channelId as string,
          cursor,
        });
        if (res?.data && res?.data?.messages?.length >= 1) {
          if (res?.data?.messages[0]?.channel_id === channelId) {
            const messages = res?.data?.messages as TMessageData[];
            setTargetScroll(messages[messages.length - 1]?.message_id);
            setMessages((prev) => [...messages, ...prev]);
            if (res?.data?.cursor) {
              setCursor(res?.data?.cursor);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  return (
    <div className="relative flex-1 w-full overflow-auto">
      {messages.length >= 100 ? (
        <div className="flex items-center justify-center w-full py-1">
          <button
            type="button"
            onClick={handleGetMoreMessage}
            className="px-4 py-1 text-xs font-normal transition-all border rounded-md opacity-40 bg-background/80 hover:opacity-85"
          >
            {isLoading ? "Loading..." : "More"}
          </button>
        </div>
      ) : null}
      <ul className="flex flex-col w-full gap-5 px-4 py-2 pb-20 h-fit">
        {messages?.length <= 0 && isLoading ? (
          <LoaderSpinner />
        ) : messages?.length >= 1 && !isError ? (
          messages.map((message: TMessageData, i: number) => {
            return (
              <MessageCard
                key={message.id}
                lastMessage={i === messages.length - 1}
                message={message}
              />
            );
          })
        ) : (messages?.length <= 0 || isError) && !isLoading ? (
          <div className="flex flex-col items-center w-full gap-2 pt-10">
            <MessageSquare size={40} className="opacity-70" />
            <p className="text-sm font-semibold opacity-70">Empty chat</p>
          </div>
        ) : null}
      </ul>
    </div>
  );
}
