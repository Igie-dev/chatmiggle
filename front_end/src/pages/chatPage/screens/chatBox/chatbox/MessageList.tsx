/* eslint-disable no-empty */
import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import MessageCard from "./MessageCard";
import { MessageSquare } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
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
  //First fetch messages when render the component / if channel change
  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getMessages({ channelId: channelId as string });

        if (res?.data) {
          const newMessages = res.data?.messages as TMessageData[];
          const providedCursor = res.data?.cursor;
          if (newMessages?.length >= 1) {
            if (newMessages[0]?.channel_id === channelId) {
              setMessages(newMessages);
              //set taget scroll to bottom
              //first fetch
              setTargetScroll(newMessages[newMessages.length - 1]?.message_id);
              if (providedCursor) {
                setCursor(providedCursor);
              }
            } else {
              setMessages([]);
            }
          }
        }
      } catch (error) {}
    })();

    return () => {
      setMessages([]);
      setCursor(null);
      setTargetScroll("");
    };
  }, [getMessages, channelId]);

  useLayoutEffect(() => {
    //handle scroll to bottom
    if (targetScroll) {
      const targetEl = document.getElementById(targetScroll) as HTMLElement;
      targetEl?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [targetScroll, messages]);

  //Handle data from socket
  useEffect(() => {
    socket.on("new_message", (res: { data: TChannelData }) => {
      if (res?.data) {
        if (res?.data?.channel_id != channelId) return;
        const newMessage = res?.data.messages[0] as TMessageData;
        setMessages((prev: TMessageData[]) => [...prev, newMessage]);
        setTargetScroll(newMessage?.message_id);
      }
    });
    return () => {
      socket.off("new_message");
    };
  }, [channelId]);

  //Messages pagination
  //Requst another messages with the cursor to paginate
  //The respose will be added to top of current messages
  const handleGetMoreMessage = () => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getMessages({
          channelId: channelId as string,
          cursor,
        });

        if (res?.data) {
          const newMessages = res.data?.messages as TMessageData[];
          const providedCursor = res.data?.cursor;
          if (newMessages?.length >= 1) {
            if (newMessages[0]?.channel_id === channelId) {
              //Set the id of target element to scroll
              //To make not scroll to very bottom when data added
              //The id was the first data of this request
              //To make scroll on top of first fetch
              setTargetScroll(newMessages[messages.length - 1]?.message_id);
              setMessages((prev) => [...newMessages, ...prev]);
              setCursor(providedCursor);
            }
          }
        }
      } catch (error) {}
    })();
  };

  return (
    <div className="relative flex-1 w-full pt-10 overflow-auto">
      {cursor ? (
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
      <ul className="flex flex-col w-full gap-8 px-4 py-2 pb-20 h-fit">
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          <>
            {isError && messages?.length <= 0 ? (
              <div className="flex flex-col items-center w-full gap-2 pt-10">
                <MessageSquare size={40} className="opacity-70" />
                <p className="text-sm font-semibold opacity-70">Empty chat</p>
              </div>
            ) : (
              messages.map((message: TMessageData, i: number) => {
                return (
                  <MessageCard
                    key={message.message_id}
                    lastMessage={i === messages.length - 1}
                    message={message}
                  />
                );
              })
            )}
          </>
        )}
      </ul>
    </div>
  );
}
