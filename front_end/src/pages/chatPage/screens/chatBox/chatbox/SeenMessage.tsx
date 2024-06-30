import { useEffect, useState } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import DisplayGroupMemberSeen from "./DisplayGroupMemberSeen";
import { useSeenChannelMutation } from "@/service/slices/channel/channelApiSlice";
import useListenMessageSeen from "@/hooks/useListenMessageSeen";
type Props = {
  message: TMessageData;
};
export default function SeenMessage({ message }: Props) {
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  const [membersSeen, setMembersSeen] = useState<TChannelMemberData[]>(
    message.channel.members.filter((m) => m.isSeen && m.joinApproved)
  );
  const [mutate] = useSeenChannelMutation();
  const seenChannel = useListenMessageSeen();

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(async () => {
      const checkUser = membersSeen.filter((m) => m.userId === currentUserId);
      if (checkUser.length >= 1) {
        clearInterval(interval);
        return;
      }
      await mutate({
        channelId: message.channelId,
        userId: currentUserId,
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [membersSeen, message, currentUserId, mutate]);

  useEffect(() => {
    if (seenChannel) {
      if (seenChannel.channelId !== message.channelId) return;
      const memberSeenNew = seenChannel.members.filter(
        (m) => m.isSeen && m.joinApproved
      );
      const prevMemberSeen = membersSeen.filter(
        (m) => m.isSeen && m.joinApproved
      );
      if (memberSeenNew.length === prevMemberSeen.length) return;
      setMembersSeen(memberSeenNew);
    }
  }, [seenChannel, currentUserId, membersSeen, message]);

  const mateSeen = membersSeen.length >= 2;

  if (!mateSeen) return null;

  return (
    <DisplayGroupMemberSeen members={membersSeen} senderId={message.senderId} />
  );
}
