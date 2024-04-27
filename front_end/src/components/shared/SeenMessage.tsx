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
    if (message.channel.members.length >= 0 && message.message_id) {
      const mates = message.channel.members.filter(
        (m) => m.user_id !== user_id && m.is_seen
      );
      setMembersSeen(mates);
    }
  }, [user_id, message.channel.members, message.message_id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (message.sender_id !== user_id) {
      interval = setInterval(async () => {
        await asyncEmit("seen", {
          channel_id: message.channel_id,
          user_id,
        });
      }, 1000);
    }

    socket.on("message_seen", (res) => {
      if (res?.data && res?.data.channel_id === message.channel_id) {
        if (membersSeen.length === res.data.members.lenth) {
          return;
        }
        setMembersSeen(res.data.members);
      }
    });

    return () => {
      clearInterval(interval);
      socket.off("message_seen");
    };
  }, [user_id, message.channel_id, membersSeen.length, message.sender_id]);

  return user_id === message.sender_id ? (
    <>
      {membersSeen.length && message.channel.is_private ? (
        <p className="mr-2  font-semibold text-[10px] opacity-50   rounded-lg">
          Seen
        </p>
      ) : null}
    </>
  ) : !message.channel.is_private && membersSeen.length >= 1 ? (
    <DisplayGroupMemberSeen members={membersSeen} />
  ) : null;
}
