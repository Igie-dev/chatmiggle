import { useEffect, useState } from "react";
import { socket } from "@/socket";
export default function useListenChangeGroupName(channelId: string) {
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    socket.on(
      "change_group_name",
      (res: { data: { channelId: string; groupName: string } }) => {
        if (channelId !== res?.data?.channelId) return;
        setNewGroupName(res.data.groupName);
      }
    );

  }, [channelId]);

  return newGroupName;
}
