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
      const usersSeen = members.filter(
        (m) => m.user_id === user_id && m.is_seen && !m.is_deleted
      );
      setIsSeen(usersSeen.length >= 1);
    }
  }, [user_id, members, messageId, senderId]);

  useEffect(() => {
    if (isSeen) return;
    socket.on("seen_channel", (res: { data: TChannelData }) => {
      if (res?.data) {
        const foundUser = res?.data?.members.filter(
          (m) => m.user_id === user_id && m.is_seen && !m.is_deleted
        );
        if (foundUser.length >= 1) {
          setIsSeen(true);
        }
      }
    });
    return () => {
      socket.off("seen_channel");
    };
  }, [members, isSeen, user_id]);

  return senderId !== user_id ? (
    <>
      {isSeen ? null : (
        <p className="absolute top-1 right-2 text-[10px] opacity-50">New</p>
      )}
    </>
  ) : null;
}
