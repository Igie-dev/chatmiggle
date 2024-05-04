import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { isToday, formatDate, formatTime } from "@/utils/dateUtil";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import SeenMessage from "@/components/shared/SeenMessage";
import { Bell } from "lucide-react";
import ImageMessage from "./ImageMessage";
import { EMessageTypes } from "@/types/enums";
type Props = {
  message: TMessageData;
  lastMessage?: boolean;
};
export default function MessageCard({ message, lastMessage }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const senderMe = user_id === message.sender_id;
  const senderData = message.channel.members.filter(
    (m) => m.user_id === message.sender_id
  );

  return (
    <>
      {message?.type === EMessageTypes.TYPE_NOTIF ? (
        <li
          id={message.message_id}
          className="flex flex-col items-center justify-center w-full h-16"
        >
          <Bell size={20} strokeWidth={1} className="opacity-50" />
          <p className="text-[10px] font-light opacity-50">
            {message?.message}
          </p>
        </li>
      ) : message?.type === EMessageTypes.TYPE_TEXT ||
        message.type === EMessageTypes.TYPE_IMG ? (
        <li
          id={message.message_id}
          className="flex justify-start w-full h-fit "
        >
          {!senderMe ? (
            <div className="mr-1 w-9 h-9">
              <DisplayAvatar
                id={(senderData[0]?.user?.avatar_id as string) ?? ""}
              />
            </div>
          ) : null}
          <div
            className={`relative w-full h-fit flex justify-start  ${
              senderMe ? "flex-row-reverse " : ""
            }`}
          >
            {message?.type === EMessageTypes.TYPE_TEXT ? (
              <pre
                className={`flex flex-wrap max-w-[60%] mt-2 border p-2 rounded-md lg:max-w-[50%] font-sans text-sm whitespace-pre-wrap w-fit break-all ${
                  senderMe ? "bg-accent/70" : "bg-transparent"
                }`}
              >
                {message.message}
              </pre>
            ) : message?.type === EMessageTypes.TYPE_IMG ? (
              <ImageMessage message={message} />
            ) : null}
            <div className="absolute flex -bottom-4 w-fit opacity-80">
              {lastMessage ? <SeenMessage message={message} /> : null}
              <p className="font-thin text-[10px]">
                {isToday(message.createdAt)
                  ? `Sent ${formatTime(message.createdAt)}`
                  : `Sent ${formatDate(message.createdAt)} ${formatTime(
                      message.createdAt
                    )}`}
              </p>
            </div>
          </div>
        </li>
      ) : null}
    </>
  );
}
