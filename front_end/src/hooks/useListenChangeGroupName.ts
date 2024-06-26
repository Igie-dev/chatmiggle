import { useEffect, useState } from "react";
import { socket } from "@/socket";
export default function useListenChangeGroupName(channel_id: string) {
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    socket.on(
      "change_group_name",
      (res: { data: { channel_id: string; group_name: string } }) => {
        const channelId = res.data.channel_id;
        if (channelId !== channel_id) return;
        setNewGroupName(res.data.group_name);
      }
    );

  }, [channel_id]);

  return newGroupName;
}
