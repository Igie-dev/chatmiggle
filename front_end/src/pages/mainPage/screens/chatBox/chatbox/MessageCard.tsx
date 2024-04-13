import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { isToday, formatDate, formatTime } from "@/lib/dateFormat";
import UserAvatar from "@/components/shared/UserAvatar";
type Props = {
  message: TMessageData;
};
export default function MessageCard({ message }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const senderMe = user_id === message.sender_id;
  return (
    <li id={message.message_id} className="flex justify-start w-full h-fit ">
      {!senderMe ? (
        <div className="mr-1 w-9 h-9">
          <UserAvatar userId={message.sender_id} />
        </div>
      ) : null}
      <div
        className={`relative w-full h-fit flex justify-start  ${
          senderMe ? "flex-row-reverse " : ""
        }`}
      >
        <pre
          className={`flex flex-wrap max-w-[60%] mt-2 border p-2 rounded-md lg:max-w-[50%] font-sans text-sm whitespace-pre-wrap w-fit break-all ${
            senderMe ? "bg-primary-foreground/70" : "bg-transparent"
          }`}
        >
          {message.message}
        </pre>
        <p className="absolute text-[10px] top-full opacity-40">
          {isToday(message.createdAt)
            ? `${formatTime(message.createdAt)}`
            : `${formatDate(message.createdAt)} ${formatTime(
                message.createdAt
              )}`}
        </p>
      </div>
    </li>
  );
}
