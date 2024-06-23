
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/service/slices/user/userSlice';
import { useAppSelector } from '@/service/store';
import { socket } from "@/socket";
export default function useListenMessageSeen() {
    const [channel, setChannel] = useState<TChannelData | null>(null);
    const { user_id } = useAppSelector(getCurrentUser);


    useEffect(() => {
        socket.on("seen", (res: { data: TChannelData }) => {
            const channel = res.data;
            const members = channel.members;
            const user = members.filter((m) => m.user_id === user_id);
            if (user.length <= 0) return;
            setChannel(res.data)
        })

    }, [user_id])

    return channel;
}
