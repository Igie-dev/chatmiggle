import MemberCard from "./MemberCard";
import { useEffect, useState } from "react";
import useListenAddGroupMember from "@/hooks/useListenAddGroupMember";
import useListenRemoveUserFromGroup from "@/hooks/useListenRemoveUserFromGroup";
type Props = {
  channel: TChannelData;
};
export default function GroupMembers({ channel }: Props) {
  const [members, setMembers] = useState<TChannelMemberData[]>([]);
  const [adminId, setAdminId] = useState("");
  const newMembers = useListenAddGroupMember(channel.channel_id);
  const { channelId: removedChannelId, userId: removeUserId } =
    useListenRemoveUserFromGroup();

  useEffect(() => {
    if (members.length >= 1 || members[0]?.channel_id === channel?.channel_id)
      return;
    setMembers(channel?.members.filter((m) => !m.is_deleted));
    const getAdmin = channel.members.filter((m) => !m.is_deleted && m.is_admin);
    if (getAdmin.length >= 1) {
      setAdminId(getAdmin[0].user_id);
    }
  }, [channel, members]);

  useEffect(() => {
    if (!newMembers?.length) return;
    setMembers(newMembers);
  }, [newMembers]);

  useEffect(() => {
    if (removedChannelId !== channel.channel_id) return;
    setMembers((prev) => prev.filter((m) => m.user_id !== removeUserId));
  }, [channel.channel_id, removeUserId, removedChannelId]);

  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full gap-2 p-2 pt-5">
      <div className="w-full h-[95%] overflow-y-auto ">
        <ul className="flex flex-col w-full gap-1 pb-5 h-fit">
          {members?.length >= 1
            ? members.map((member) => {
                return (
                  <MemberCard
                    key={member.user_id}
                    channelId={channel?.channel_id}
                    groupName={channel?.group_name as string}
                    isPrivate={channel?.is_private}
                    userId={member.user_id}
                    adminId={adminId}
                    channelAvatarId={channel?.avatar_id as string}
                  />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}
