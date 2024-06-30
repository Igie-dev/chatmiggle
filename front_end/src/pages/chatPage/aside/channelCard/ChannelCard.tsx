import { useNavigate, useParams } from "react-router-dom";
import SeenChannel from "./SeenChannel";
import { EMessageTypes } from "@/types/enums";
import ChannelAvatar from "./ChannelAvatar";
import Message from "./Message";
type Props = {
  channel: TChannelData;
  handleAside: () => void;
};
export default function ChannelCard({ channel, handleAside }: Props) {
  const navigate = useNavigate();
  const { channelId } = useParams();

  const handleClick = () => {
    navigate(`/c/${channel?.channelId}`);
    handleAside();
  };
  return (
    <li
      onClick={handleClick}
      className={`group flex items-start w-full gap-3 p-2 py-2 rounded-sm border transition-all  relative cursor-pointer h-fit ${
        channelId === channel?.channelId
          ? "bg-background/80 lg:bg-secondary/80 border-border "
          : "bg-transparent border-transparent hover:bg-background/80 lg:hover:bg-secondary/80"
      }`}
    >
      <ChannelAvatar avatarId={channel?.avatarId as string} />
      <div className={`flex flex-col w-[70%] h-full justify-center `}>
        <p className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
          {channel.channelName}
        </p>
        {channel?.messages?.length >= 1 ? <Message channel={channel} /> : null}
      </div>

      {channel?.messages?.length <= 0 ||
      channel?.messages[0].type === EMessageTypes.TYPE_NOTIF ? null : (
        <SeenChannel
          members={channel.members}
          senderId={channel.messages[0]?.senderId}
          messageId={channel.messages[0]?.messageId}
        />
      )}
    </li>
  );
}
