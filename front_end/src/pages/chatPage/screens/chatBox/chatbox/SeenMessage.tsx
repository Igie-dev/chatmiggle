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
    const matesSeen = members.filter((m) => m.is_seen && !m.is_deleted);
    setMembersSeen(matesSeen);
  }, [user_id, message]);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(async () => {
      const checkUser = membersSeen.filter((m) => m.user_id === user_id);
      if (checkUser.length >= 1) {
        clearInterval(interval);
        return;
      }
      await asyncEmit("seen", {
        channel_id: message.channel_id,
        user_id,
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [membersSeen, message, user_id]);

  useEffect(() => {
    socket.on("message_seen", (res: { data: TChannelData }) => {
      if (res?.data) {
        const channel = res?.data;
        setMembersSeen(channel?.members);
      }
    });

    return () => {
      socket.off("message_seen");
    };
  }, [user_id, message, message.sender_id]);
  return user_id === message.sender_id ? (
    <>
      {membersSeen.length > 1 && message?.channel?.is_private ? (
        <p className="mr-2  font-semibold text-[10px] opacity-50   rounded-lg">
          Seen
        </p>
      ) : null}
    </>
  ) : !message.channel.is_private && membersSeen.length > 1 ? (
    <DisplayGroupMemberSeen
      members={membersSeen}
      senderId={message.sender_id}
    />
  ) : null;
}
