
import { useState, useEffect } from 'react'
import { socket } from "@/socket";
import { getCurrentUser } from '@/service/slices/user/userSlice';
import { useAppSelector } from '@/service/store';
export default function useListenRemoveUserFromGroup() {
    const [channelId, setChannelId] = useState("");
    const [userId, setUserId] = useState("");
    const { userId: currentUserId } = useAppSelector(getCurrentUser);

    useEffect(() => {
        socket.on("remove_group_member", (res: { data: { channelId: string, userId: string } }) => {
            setChannelId(res?.data?.channelId);
            setUserId(res?.data?.userId);
        })
    }, [currentUserId])

    return { channelId, userId }
}
