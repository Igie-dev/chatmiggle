import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
type Props = {
  channel: TChannelData;
};
export default function SeenChannel({ channel }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [isSeen, setIsSeen] = useState(false);

  useEffect(() => {
    if (channel.messages[0]?.message_id && channel.members.length >= 1) {
      const user = channel.members.filter(
        (m) => m.user_id === user_id && m.is_seen
      );

      const isSeenByUser = user.length >= 1;
      setIsSeen(isSeenByUser);
    }
  }, [user_id, channel.members, channel.messages]);

  useEffect(() => {
    socket.emit("listen_seen_channel", channel.channel_id);
    socket.on("seen_channel", (res: { data: TChannelData }) => {
      if (res?.data.channel_id === channel.channel_id && !isSeen) {
        setIsSeen(true);
      }
    });

    return () => {
      socket.off("seen_channel");
    };
  }, [channel?.channel_id, isSeen]);

  return channel.messages[0].sender_id !== user_id ? (
    <>
      {isSeen ? null : (
        <p className="absolute top-0 right-1 text-[10px] opacity-50">New</p>
      )}
    </>
  ) : null;
}
