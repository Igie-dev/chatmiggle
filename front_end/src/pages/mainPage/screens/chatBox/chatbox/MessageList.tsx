import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import MessageCard from "./MessageCard";
import { MessageSquare } from "lucide-react";
import useChannelMessages from "@/hooks/useChannelMessages";
import { useEffect } from "react";

export default function MessageList() {
  const { channelId } = useParams();
  const { messages, isFetching, isError, refetch, setCursor } =
    useChannelMessages(channelId as string);
  //handle scroll to bottom
  useEffect(() => {
    if (messages?.length >= 5) {
      const targetEl = document.getElementById(
        `${messages[messages.length - 1]?.message_id}`
      ) as HTMLElement;

      targetEl?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  //*TODO Fix this handle refetch
  //Handle refetch when view on top
  useEffect(() => {
    if (messages?.length <= 99) return;
    let timeout: NodeJS.Timeout;
    const el = document.getElementById(
      `${messages[0]?.message_id}`
    ) as HTMLElement;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeout = setTimeout(() => {
            if (messages?.length >= 100) {
              const lastMessage = messages[0]?.id;
              console.log(lastMessage);
              setCursor(`${lastMessage}`);
            }
            refetch();
          }, 500);
          console.log("Show");
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    const interval = setInterval(() => {
      observer.observe(el);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [messages, refetch, setCursor]);

  return (
    <div className="relative flex-1 w-full overflow-auto">
      <div
        className={`sticky top-0 left-0 z-40 flex justify-center w-full py-2  transition-all ${
          messages?.length >= 1 && isFetching ? "visible" : "hidden"
        }`}
      >
        <p className="px-4 py-2 text-sm border rounded-full bg-background/80">
          Please wait...
        </p>
      </div>
      <ul className="flex flex-col w-full gap-5 px-4 py-2 pb-20 h-fit">
        {messages?.length <= 0 && isFetching ? (
          <LoaderSpinner />
        ) : messages?.length >= 1 && !isError ? (
          messages.map((message: TMessageData) => {
            return (
              <MessageCard
                key={message.message_id + Math.random()}
                message={message}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center w-full gap-2 pt-10">
            <MessageSquare size={40} className="opacity-70" />
            <p className="text-sm font-semibold opacity-70">Empty chat</p>
          </div>
        )}
      </ul>
    </div>
  );
}
