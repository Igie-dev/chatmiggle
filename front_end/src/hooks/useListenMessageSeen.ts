
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/service/slices/user/userSlice';
import { useAppSelector } from '@/service/store';
import { socket } from "@/socket";
export default function useListenMessageSeen() {
    const [channel, setChannel] = useState<TChannelData | null>(null);
    const { userId: currentUserId } = useAppSelector(getCurrentUser);
    useEffect(() => {
        socket.on("seen", (res: { data: TChannelData }) => {
            const channel = res.data;
            const members = channel.members;
            const user = members.filter((m) => m.userId === currentUserId);
            if (user.length <= 0) {
                setChannel(null)
            } else {
                setChannel(res.data)
            }

        })

    }, [currentUserId])

    return channel;
}
