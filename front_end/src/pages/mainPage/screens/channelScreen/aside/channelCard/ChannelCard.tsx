import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { isToday, formatTime, formatDate } from "@/utils/dateFormat";
import { useNavigate, useParams } from "react-router-dom";
import DisplayUserName from "../../../../../../components/shared/DisplayUserName";
import SeenChannel from "@/components/shared/SeenChannel";
import { EMessageTypes } from "../../../chatBox/chatbox/MessageCard";
type Props = {
  channel: TChannelData;
  handleAside: () => void;
};
export default function ChannelCard({ channel, handleAside }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const mate = channel?.members.filter((m) => m.user_id !== user_id);
  const today = isToday(channel?.messages[0]?.createdAt);
  const handleClick = () => {
    navigate(`/c/${channel?.channel_id}`);
    handleAside();
  };
  return (
    <li
      onClick={handleClick}
      className={`group flex items-start w-full gap-3 p-2 transition-all border rounded-md relative cursor-pointer h-fit ${
        channelId === channel?.channel_id
          ? "bg-accent/70 border-border/70"
          : "bg-transparent border-transparent hover:shadow-md hover:bg-accent/70"
      }`}
    >
      <div className="w-9 h-9">
        {channel.is_private ? (
          <DisplayAvatar id={mate[0]?.user_id} />
        ) : (
          <DisplayAvatar id={channel?.channel_id} />
        )}
      </div>

      <div className={`flex flex-col w-[70%] h-full justify-center `}>
        {channel?.is_private ? (
          <span className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
            <DisplayUserName userId={mate[0]?.user_id} />
          </span>
        ) : (
          <p className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
            {channel?.group_name}
          </p>
        )}

        <div className="flex items-end w-full">
          <p className="w-fit max-w-[50%] text-xs truncate opacity-70 max-h-6">
            {channel?.messages[0]?.sender_id === user_id
              ? `You: ${channel?.messages[0]?.message}`
              : `${channel?.messages[0]?.message}`}
          </p>
          <p className="ml-2 text-xs opacity-40">
            {today
              ? `${formatTime(channel?.messages[0]?.createdAt)}`
              : `${formatDate(channel?.messages[0]?.createdAt)} ${formatTime(
                  channel?.messages[0]?.createdAt
                )} `}
          </p>
        </div>
      </div>

      {channel?.messages[0].type === EMessageTypes.TYPE_NOTIF ? null : (
        <SeenChannel
          members={channel.members}
          senderId={channel.messages[0]?.sender_id}
          messageId={channel.messages[0]?.message_id}
        />
      )}
    </li>
  );
}
