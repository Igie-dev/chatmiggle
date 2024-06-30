import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { EMessageTypes } from "@/types/enums";
import { isToday, formatTime, formatDate } from "@/utils/dateUtil";
import { decryptText } from "@/utils/helper";
type Props = {
  channel: TChannelData;
};
export default function Message({ channel }: Props) {
  const today = isToday(channel?.messages[0]?.createdAt);
  return (
    <div className="flex items-end w-full text-muted-foreground">
      <MessageContent message={channel.messages[0]} />
      <p className="ml-2 text-xs ">
        {today
          ? `${formatTime(channel?.messages[0]?.createdAt)}`
          : `${formatDate(channel?.messages[0]?.createdAt)} ${formatTime(
              channel?.messages[0]?.createdAt
            )} `}
      </p>
    </div>
  );
}

const MessageContent = ({ message }: { message: TMessageData }) => {
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  return message.type === EMessageTypes.TYPE_TEXT ||
    message.type === EMessageTypes.TYPE_NOTIF ? (
    <p className="w-fit max-w-[50%] text-xs truncate  max-h-6">
      {message?.senderId === currentUserId
        ? `You: ${decryptText(message?.message)}`
        : `${decryptText(message?.message)}`}
    </p>
  ) : message?.type === EMessageTypes.TYPE_IMG ? (
    <p className="w-fit max-w-[50%] text-xs truncate  max-h-6">Image</p>
  ) : null;
};
