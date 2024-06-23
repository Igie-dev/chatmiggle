import { useEffect, useState } from 'react'
import { socket } from "@/socket";
import { useAppSelector } from '@/service/store';
import { getCurrentUser } from '@/service/slices/user/userSlice';
export default function useListenNewMessage() {
    const [newMessage, setNewMessage] = useState<TChannelData | null>(null);
    const { user_id } = useAppSelector(getCurrentUser);
    useEffect(() => {
        socket.on("new_message", (res: { data: TChannelData }) => {
            const channel = res.data;
            const members = channel.members;
            const user = members.filter((m) => m.user_id === user_id);
            if (user.length <= 0) return;
            setNewMessage(channel)
        })

    }, [user_id])
    return newMessage
}
