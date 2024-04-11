import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import UserAvatar from "@/components/shared/UserAvatar";
import { isToday, formatTime, formatDate } from "@/lib/dateFormat";
import { useNavigate, useParams } from "react-router-dom";
import DisplayUserName from "./DisplayUserName";
type Props = {
  channel: TChannelData;
};
export default function ChannelCard({ channel }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const mate_id =
    channel?.members[0].user_id === user_id
      ? channel?.members[1].user_id
      : channel?.members[0].user_id;
  const today = isToday(channel.messages[0].createdAt);

  const handleClick = () => {
    navigate(`/c/${channel.channel_id}`);
  };

  return (
    <li
      onClick={handleClick}
      className={`flex items-start w-full gap-3 p-2 transition-all border rounded-md cursor-pointer h-fit ${
        channelId === channel.channel_id
          ? "bg-primary-foreground border-border/70"
          : "bg-transparent border-transparent hover:shadow-md hover:bg-primary-foreground"
      }`}
    >
      <div className="w-11 h-11">
        <UserAvatar userId={mate_id} />
      </div>
      <div className="flex flex-col w-[80%] h-full justify-center">
        {channel?.isPrivate ? (
          <span className="w-full max-w-full text-sm font-semibold truncate opacity-90 max-h-6">
            <DisplayUserName userId={mate_id} />
          </span>
        ) : (
          <p className="w-full max-w-full text-sm font-semibold truncate opacity-90 max-h-6">
            {channel?.group_name}
          </p>
        )}

        <div className="flex items-end w-full ">
          <p className="w-fit max-w-[50%] text-xs truncate opacity-70 max-h-6">
            {channel.messages[0].sender_id === user_id
              ? `You: ${channel.messages[0].message}`
              : `${channel.messages[0].message}`}
          </p>
          <p className="ml-2 text-xs opacity-40">
            {today
              ? `${formatTime(channel.messages[0].createdAt)}`
              : `${formatDate(channel.messages[0].createdAt)} ${formatTime(
                  channel.messages[0].createdAt
                )} `}
          </p>
        </div>
      </div>
    </li>
  );
}
