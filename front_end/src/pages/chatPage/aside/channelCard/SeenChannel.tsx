import { useMemo } from "react";
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
  const seenChannel = useListenMessageSeen();
  const isSeen = useMemo((): boolean => {
    let seen = false;

    if (members?.length >= 1) {
      const membersSeen = members.filter(
        (m) => m.is_seen && !m.is_deleted && m.user_id === user_id
      );
      seen = membersSeen.length >= 1;
    }

    if (!seen && seenChannel?.messages[0].message_id === messageId) {
      const membersSeen = seenChannel.members.filter(
        (m) => m.is_seen && !m.is_deleted && m.user_id === user_id
      );
      seen = membersSeen.length >= 1;
    }
    return seen;
  }, [messageId, members, seenChannel, user_id]);

  if (senderId !== user_id && !isSeen) {
    return <p className="absolute top-1 right-2 text-[10px] opacity-50">New</p>;
  }

  return null;
}
