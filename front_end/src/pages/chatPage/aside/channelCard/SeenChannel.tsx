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
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  const seenChannel = useListenMessageSeen();
  const isSeen = useMemo((): boolean => {
    let seen = false;

    if (members?.length >= 1) {
      const membersSeen = members.filter(
        (m) => m.isSeen && m.joinApproved && m.userId === currentUserId
      );
      seen = membersSeen.length >= 1;
    }

    if (!seen && seenChannel?.messages[0].messageId === messageId) {
      const membersSeen = seenChannel.members.filter(
        (m) => m.isSeen && m.joinApproved && m.userId === currentUserId
      );
      seen = membersSeen.length >= 1;
    }
    return seen;
  }, [messageId, members, seenChannel, currentUserId]);

  if (senderId !== currentUserId && !isSeen) {
    return <p className="absolute top-1 right-2 text-[10px] opacity-50">New</p>;
  }

  return null;
}
