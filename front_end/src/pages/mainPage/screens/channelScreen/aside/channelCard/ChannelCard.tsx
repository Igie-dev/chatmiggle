import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import UserAvatar from "@/components/shared/UserAvatar";
import { isToday, formatTime, formatDate } from "@/lib/dateFormat";
import { useNavigate, useParams } from "react-router-dom";
import DisplayUserName from "./DisplayUserName";
import SeenChannel from "@/components/shared/SeenChannel";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
type Props = {
  channel: TChannelData;
};
export default function ChannelCard({ channel }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const navigate = useNavigate();
  const { channelId } = useParams();

  const mate_id =
    channel?.members[0]?.user_id === user_id
      ? channel?.members[1]?.user_id
      : channel?.members[0]?.user_id;
  const today = isToday(channel?.messages[0]?.createdAt);

  const handleClick = () => {
    navigate(`/c/${channel.channel_id}`);
  };
  return (
    <li
      onClick={handleClick}
      className={`group flex items-start w-full gap-3 p-2 transition-all border rounded-md relative cursor-pointer h-fit ${
        channelId === channel.channel_id
          ? "bg-primary-foreground border-border/70"
          : "bg-transparent border-transparent hover:shadow-md hover:bg-primary-foreground"
      }`}
    >
      {channel.is_private ? (
        <div className="w-9 h-9">
          <UserAvatar userId={mate_id} />
        </div>
      ) : (
        <div className="border rounded-full w-9 h-9">
          {/* <UserAvatar userId={mate_id} /> */}
        </div>
      )}
      <div className={`flex flex-col w-[70%] h-full justify-center `}>
        {channel?.is_private ? (
          <span className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
            <DisplayUserName userId={mate_id} />
          </span>
        ) : (
          <p className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
            {channel?.group_name}
          </p>
        )}

        <div className="flex items-end w-full">
          <p className="w-fit max-w-[50%] text-xs truncate opacity-70 max-h-6">
            {channel.messages[0]?.sender_id === user_id
              ? `You: ${channel.messages[0]?.message}`
              : `${channel.messages[0]?.message}`}
          </p>
          <p className="ml-2 text-xs opacity-40">
            {today
              ? `${formatTime(channel.messages[0]?.createdAt)}`
              : `${formatDate(channel.messages[0]?.createdAt)} ${formatTime(
                  channel.messages[0]?.createdAt
                )} `}
          </p>
        </div>
      </div>
      <Button
        size="icon"
        variant="outline"
        className="transition-all border-transparent rounded-full opacity-0 bg-primary-foreground group-hover:opacity-100 group-hover:border-border"
      >
        <EllipsisVertical size={16} />
      </Button>
      <SeenChannel
        members={channel.members}
        senderId={channel.messages[0]?.sender_id}
        messageId={channel.messages[0]?.message_id}
      />
    </li>
  );
}
