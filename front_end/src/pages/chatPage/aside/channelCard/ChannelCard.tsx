import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { useNavigate, useParams } from "react-router-dom";
import SeenChannel from "./SeenChannel";
import { EMessageTypes } from "@/types/enums";
import ChannelAvatar from "./ChannelAvatar";
import SenderName from "./SenderName";
import Message from "./Message";
type Props = {
  channel: TChannelData;
  handleAside: () => void;
};
export default function ChannelCard({ channel, handleAside }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const mate: TChannelMemberData[] = channel?.members.filter(
    (m) => m.user_id !== user_id
  );

  const handleClick = () => {
    navigate(`/c/${channel?.channel_id}`);
    handleAside();
  };
  return (
    <li
      onClick={handleClick}
      className={`group flex items-start w-full gap-3 p-2 py-3 transition-all  relative cursor-pointer h-fit ${
        channelId === channel?.channel_id
          ? "bg-secondary/80"
          : "bg-transparent  hover:bg-secondary/80"
      }`}
    >
      <ChannelAvatar
        avatarId={
          channel.is_private
            ? (mate[0]?.user?.avatar_id as string)
            : (channel?.avatar_id as string)
        }
      />
      <div className={`flex flex-col w-[70%] h-full justify-center `}>
        <SenderName
          isPrivate={channel?.is_private}
          groupName={channel?.group_name}
          senderId={mate[0]?.user_id}
        />
        <Message channel={channel} />
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
