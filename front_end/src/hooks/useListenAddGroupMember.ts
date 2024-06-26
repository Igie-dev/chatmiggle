import { useEffect, useState } from 'react'
import { socket } from "@/socket";
import { useParams } from 'react-router-dom';
export default function useListenAddGroupMember() {
    const [newMembers, setNewMembers] = useState<TChannelMemberData[] | null>(null);
    const { channelId } = useParams();
    useEffect(() => {
        socket.on(
            "add_member",
            (res: { data: TChannelData }) => {
                const channel_Id = res.data.channel_id;
                const members = res.data.members
                if (channel_Id !== channelId) {
                    setNewMembers(null)
                } else {
                    const filterMembers = members.filter((member) => !member.is_deleted);
                    setNewMembers(filterMembers);
                }

            }
        );

    }, [newMembers, channelId]);

    return newMembers
}
