import { useEffect, useState } from 'react'
import { socket } from "@/socket";
export default function useListenAddGroupMember(channelId: string) {
    const [newMembers, setNewMembers] = useState<TChannelMemberData[] | null>(null);

    useEffect(() => {
        socket.on(
            "add_member",
            (res: { data: TChannelData }) => {
                const channel_Id = res.data.channel_id;
                const members = res.data.members
                if (channel_Id !== channelId) return;
                const filterMembers = members.filter((member) => !member.is_deleted);
                setNewMembers(filterMembers);
            }
        );

    }, [newMembers, channelId]);

    return newMembers
}
