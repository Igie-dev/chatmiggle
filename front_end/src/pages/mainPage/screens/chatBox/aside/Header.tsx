import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import DisplayUserName from "@/components/shared/DisplayUserName";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import ChangeGroupName from "./ChangeGroupName";
type Props = {
  channel: TChannelData;
  isFetching: boolean;
};

function Header({ channel, isFetching }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [groupName, setGroupName] = useState("");
  const mate: TChannelMemberData[] = channel?.members.filter(
    (m) => m.user_id !== user_id
  );

  useEffect(() => {
    setGroupName(channel?.group_name as string);
    socket.on("new_group_name", (res) => {
      if (res?.data) {
        const groupName = res?.data?.group_name;
        if (groupName) {
          setGroupName(groupName);
        }
      }
    });
  }, [channel?.group_name]);

  return (
    <header className="flex flex-col items-center justify-between w-full gap-5 px-5 py-4 border rounded-md h-fit bg-accent/50">
      <div className="flex flex-col items-center justify-center w-full gap-2 ">
        <div className="w-16 h-16 overflow-hidden border rounded-full">
          {isFetching ? (
            <Skeleton className="w-full h-full" />
          ) : channel && channel?.is_private ? (
            <DisplayAvatar id={(mate[0]?.user?.avatar_id as string) ?? ""} />
          ) : (
            <DisplayAvatar id={(channel?.avatar_id as string) ?? ""} />
          )}
        </div>
        {isFetching ? (
          <div className="w-[70%] h-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <span className="font-normal truncate text-medium">
            {channel && channel?.is_private ? (
              <DisplayUserName userId={mate[0]?.user_id} />
            ) : (
              groupName
            )}
          </span>
        )}
      </div>
      {!channel?.is_private ? (
        <div className="flex items-center justify-center w-full gap-1">
          <ChangeGroupName
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            avatarId={channel?.avatar_id as string}
          />
          <Button size="icon" variant="outline">
            <Link
              to={`/avatar/upload/${channel?.channel_id}`}
              className="flex !justify-start w-full !px-2"
            >
              <Image size={20} />
            </Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
