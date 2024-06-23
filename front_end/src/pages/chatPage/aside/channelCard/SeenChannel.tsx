import { useEffect, useState } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import useListenMessageSeen from "@/hooks/useListenMessageSeen";
type Props = {
  members: TChannelMemberData[];
  senderId: string;
  messageId: string;
};
export default function SeenChannel({ members, senderId, messageId }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [isSeen, setIsSeen] = useState(false);
  const seenChannel = useListenMessageSeen();

  useEffect(() => {
    const isUserSeen = members.filter(
      (m) => m.is_seen && !m.is_deleted && m.user_id === user_id
    );
    if (isUserSeen.length >= 1) {
      setIsSeen(true);
    } else {
      setIsSeen(false);
    }
  }, [members, user_id]);

  useEffect(() => {
    if (isSeen) return;
    if (seenChannel) {
      if (seenChannel.messages[0].message_id !== messageId) return;
      const foundUser = seenChannel.members.filter(
        (m) => m.user_id === user_id && m.is_seen && !m.is_deleted
      );
      if (foundUser.length >= 1) {
        setIsSeen(true);
      }
    }
  }, [isSeen, user_id, seenChannel, messageId]);

  if (senderId !== user_id && !isSeen) {
    return <p className="absolute top-1 right-2 text-[10px] opacity-50">New</p>;
  }

  return null;
}
