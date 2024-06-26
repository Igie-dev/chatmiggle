
import { useState, useEffect } from 'react'
import { socket } from "@/socket";
import { getCurrentUser } from '@/service/slices/user/userSlice';
import { useAppSelector } from '@/service/store';
export default function useListenRemoveUserFromGroup() {
    const [channelId, setChannelId] = useState("");
    const [userId, setUserId] = useState("");
    const { user_id } = useAppSelector(getCurrentUser);

    useEffect(() => {
        socket.on("remove_group_member", (res: { data: { channel_id: string, user_id: string } }) => {
            setChannelId(res.data.channel_id);
            setUserId(res.data.user_id);
        })
    }, [user_id])

    return { channelId, userId }
}
