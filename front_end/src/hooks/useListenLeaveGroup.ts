import { useEffect, useState } from 'react'
import { socket } from "@/socket";
import { useAppSelector } from '@/service/store';
import { getCurrentUser } from '@/service/slices/user/userSlice';

export default function useListenLeaveGroup() {
    const [channelId, setChannelId] = useState("");
    const [userId, setUserId] = useState("");
    const { user_id } = useAppSelector(getCurrentUser);

    useEffect(() => {
        socket.on("leave_channel", (res: { data: { channel_id: string, user_id: string } }) => {
            if (user_id !== res.data.user_id) return;
            setChannelId(res.data.channel_id);
            setUserId(res.data.user_id)
        })

    }, [user_id])

    return { channelId, userId }
}
