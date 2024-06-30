import { useEffect, useState } from 'react'
import { socket } from "@/socket";
import { useAppSelector } from '@/service/store';
import { getCurrentUser } from '@/service/slices/user/userSlice';
export default function useListenNewMessage() {
    const [newMessage, setNewMessage] = useState<TChannelData | null>(null);
    const { userId: currentUserId } = useAppSelector(getCurrentUser);
    useEffect(() => {
        socket.on("new_message", (res: { data: TChannelData }) => {
            const channel = res.data;
            const members = channel.members;
            const user = members.filter((m) => m.userId === currentUserId);
            if (user.length <= 0) {
                setNewMessage(null)
            } else {
                setNewMessage(channel)
            }

        })

    }, [currentUserId])
    return newMessage
}
