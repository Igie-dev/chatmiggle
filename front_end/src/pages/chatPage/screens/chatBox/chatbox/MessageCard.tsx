import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { isToday, formatDate, formatTime } from "@/utils/dateUtil";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import SeenMessage from "./SeenMessage";
import { Bell } from "lucide-react";
import ImageMessage from "./ImageMessage";
import { EMessageTypes } from "@/types/enums";
import { decryptText } from "@/utils/helper";
type Props = {
  message: TMessageData;
  lastMessage?: boolean;
};
export default function MessageCard({ message, lastMessage }: Props) {
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  const senderMe = currentUserId === message.senderId;
  const senderData = message.channel.members.filter(
    (m) => m.userId === message.senderId
  );

  return (
    <>
      {message?.type === EMessageTypes.TYPE_NOTIF ? (
        <li
          id={message.messageId}
          className="flex flex-col items-center justify-center w-full h-16 text-muted-foreground"
        >
          <Bell size={20} strokeWidth={1} />
          <p className="text-[10px] font-light ">{message?.message}</p>
        </li>
      ) : message?.type === EMessageTypes.TYPE_TEXT ||
        message.type === EMessageTypes.TYPE_IMG ? (
        <li id={message.messageId} className="flex justify-start w-full h-fit">
          {!senderMe ? (
            <div className="w-8 h-8 mr-1">
              <DisplayAvatar
                id={(senderData[0]?.user?.avatarId as string) ?? ""}
              />
            </div>
          ) : null}
          <div
            className={`relative w-full h-fit flex justify-start ${
              senderMe ? "flex-row-reverse " : ""
            }`}
          >
            {message?.type === EMessageTypes.TYPE_TEXT ? (
              <pre
                className={`flex flex-wrap  max-w-[70%] mt-4 border p-2 rounded-lg  font-sans text-sm whitespace-pre-wrap w-fit break-all ${
                  senderMe ? "bg-primary/80 text-white " : "bg-background "
                }`}
              >
                {decryptText(message?.message)}
              </pre>
            ) : message?.type === EMessageTypes.TYPE_IMG ? (
              <ImageMessage message={message} />
            ) : null}
            <div className="absolute flex -bottom-5 w-fit text-muted-foreground">
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
