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
  const { user_id } = useAppSelector(getCurrentUser);
  const [membersSeen, setMembersSeen] = useState<TChannelMemberData[]>(
    message.channel.members.filter((m) => m.is_seen && !m.is_deleted)
  );
  const [mutate] = useSeenChannelMutation();
  const seenChannel = useListenMessageSeen();

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(async () => {
      const checkUser = membersSeen.filter((m) => m.user_id === user_id);
      if (checkUser.length >= 1) {
        clearInterval(interval);
        return;
      }
      await mutate({
        channel_id: message.channel_id,
        user_id,
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [membersSeen, message, user_id, mutate]);

  useEffect(() => {
    if (seenChannel) {
      if (seenChannel.channel_id !== message.channel_id) return;
      const memberSeenNew = seenChannel.members.filter(
        (m) => m.is_seen && !m.is_deleted
      );
      const prevMemberSeen = membersSeen.filter(
        (m) => m.is_seen && !m.is_deleted
      );
      if (memberSeenNew.length === prevMemberSeen.length) return;
      setMembersSeen(memberSeenNew);
    }
  }, [seenChannel, user_id, membersSeen, message]);

  const mateSeen = membersSeen.length >= 2;

  if (!mateSeen) return null;

  if (message.channel.is_private && message.sender_id === user_id)
    return (
      <p className="mr-2  font-semibold text-[10px] opacity-50   rounded-lg">
        Seen
      </p>
    );

  if (!message.channel.is_private && message.sender_id === user_id) {
    return (
      <DisplayGroupMemberSeen
        members={membersSeen}
        senderId={message.sender_id}
      />
    );
  }

  return null;
}
