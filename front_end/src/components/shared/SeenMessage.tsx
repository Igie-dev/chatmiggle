import { useEffect, useState } from "react";
import { asyncEmit, socket } from "@/socket";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import DisplayGroupMemberSeen from "./DisplayGroupMemberSeen";
type Props = {
  message: TMessageData;
};
export default function SeenMessage({ message }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [membersSeen, setMembersSeen] = useState<TChannelMemberData[]>([]);

  useEffect(() => {
    const members = message.channel.members;
    if (members.length >= 1) {
      const mates = message.channel?.members.filter(
        (m) => m.is_seen && !m.is_deleted
      );
      if (membersSeen.length === 0) {
        setMembersSeen(mates);
      }
    }
  }, [user_id, message.channel.members, membersSeen.length]);

  useEffect(() => {
    socket.on("message_seen", (res: { data: TChannelData }) => {
      if (res?.data) {
        const channel = res?.data;
        if (channel.messages[0].message_id !== message.message_id) return;
        const membersSeen = channel.members.filter(
          (m) => m.is_seen && !m.is_deleted && m.user_id !== user_id
        );

        if (membersSeen.length !== membersSeen.length) {
          setMembersSeen(membersSeen);
        }
      }
    });

    return () => {
      socket.off("message_seen");
    };
  }, [user_id, message, message.sender_id]);

  useEffect(() => {
    const checkUserSeen = membersSeen.filter((m) => m.user_id === user_id);

    if (checkUserSeen.length >= 1) return;
    const interval: NodeJS.Timeout = setInterval(async () => {
      await asyncEmit("seen", {
        channel_id: message.channel_id,
        user_id,
      });
      const checkAgain = membersSeen.filter((m) => m.user_id === user_id);
      if (checkAgain.length === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [message.channel_id, user_id, membersSeen]);

  return user_id === message.sender_id ? (
    <>
      {membersSeen.length && message.channel.is_private ? (
        <p className="mr-2  font-semibold text-[10px] opacity-50   rounded-lg">
          Seen
        </p>
      ) : null}
    </>
  ) : !message.channel.is_private && membersSeen.length >= 1 ? (
    <DisplayGroupMemberSeen
      members={membersSeen}
      senderId={message.sender_id}
    />
  ) : null;
}
