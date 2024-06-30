import { useEffect, useState } from 'react'
import { socket } from "@/socket";
import { useAppSelector } from '@/service/store';
import { getCurrentUser } from '@/service/slices/user/userSlice';

export default function useListenLeaveGroup() {
    const [channelId, setChannelId] = useState("");
    const [userId, setUserId] = useState("");
    const { userId: currentUserId } = useAppSelector(getCurrentUser);

    useEffect(() => {
        socket.on("leave_channel", (res: { data: { channelId: string, userId: string } }) => {
            if (currentUserId !== res.data.userId) {
                setChannelId(res?.data?.channelId);
                setUserId(res?.data?.userId)
            } else {
                setChannelId("");
                setUserId("")
            }

        })

    }, [currentUserId])

    return { channelId, userId }
}
