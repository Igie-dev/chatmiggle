import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
type Props = {
  members: TChannelMemberData[];
  senderId: string;
  messageId: string;
};
export default function SeenChannel({ members, senderId, messageId }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [isSeen, setIsSeen] = useState(false);
  useEffect(() => {
    if (members.length >= 1) {
      const users = members.filter((m) => m.user_id === user_id && m.is_seen);
      const isSeenByUser = users.length >= 1;
      setIsSeen(isSeenByUser);
    }
  }, [user_id, members, messageId, senderId]);

  useEffect(() => {
    socket.on("seen_channel", (res: { data: TChannelData }) => {
      if (res?.data.channel_id === members[0].channel_id && !isSeen) {
        setIsSeen(true);
      }
    });

    return () => {
      socket.off("seen_channel");
    };
  }, [members, isSeen]);

  return senderId !== user_id ? (
    <>
      {isSeen ? null : (
        <p className="absolute top-0 right-2 text-[10px] opacity-50">New</p>
      )}
    </>
  ) : null;
}
