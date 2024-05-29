import { Button } from "@/components/ui/button";
import { Image, Trash } from "lucide-react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import DisplayUserName from "@/components/shared/DisplayUserName";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { socket } from "@/socket";
import ChangeGroupName from "./ChangeGroupName";
import AddMember from "./AddMember";
import LeaveGroup from "./LeaveGroup";
import DeleteChannel from "./DeleteChannel";
import CustomTooltip from "@/components/shared/CustomTooltip";
type Props = {
  channel: TChannelData;
  isFetching: boolean;
};

function Header({ channel, isFetching }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const [groupName, setGroupName] = useState("");
  const [adminId, setAdminId] = useState("");
  const mate: TChannelMemberData[] = channel?.members.filter(
    (m) => m.user_id !== user_id
  );

  const isUserAMember = channel?.members.filter((m) => m.user_id === user_id);
  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    if (!channel?.channel_id) return;
    const getAdmin = channel?.members.filter(
      (m) => !m.is_deleted && m.is_admin
    );
    if (getAdmin.length >= 1) {
      setAdminId(getAdmin[0].user_id);
    }
  }, [channel]);

  return (
    <header className="flex flex-col items-center justify-between w-full gap-2 px-5 py-4 border rounded-md h-fit bg-primary-foreground">
      <div className="flex flex-col items-center justify-center w-full space-y-4">
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

      <div className="flex items-center justify-center w-full gap-1">
        {adminId === user_id && !channel?.is_private ? (
          <AddMember
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            channelAvatarId={channel?.avatar_id as string}
          />
        ) : (
          <span />
        )}
        {!channel?.is_private ? (
          <ChangeGroupName
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            avatarId={channel?.avatar_id as string}
          />
        ) : null}
        {!channel?.is_private ? (
          <Button size="icon" variant="outline">
            <Link
              to={`/avatar/upload/${channel?.channel_id}`}
              className="flex !justify-center w-full !px-2"
            >
              <CustomTooltip title="Change profile">
                <Image size={20} />
              </CustomTooltip>
            </Link>
          </Button>
        ) : null}
        {adminId !== user_id && !channel?.is_private ? (
          <LeaveGroup
            userId={user_id}
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            cardDescription="Are you sure you want to leave this group?"
            cardTitle="Leave Group"
            type="leave"
            channelAvatarId={channel?.avatar_id as string}
          >
            <Button size="icon" variant="outline">
              <CustomTooltip title="Leave group">
                <Trash size={20} />
              </CustomTooltip>
            </Button>
          </LeaveGroup>
        ) : null}
        {adminId === user_id && !channel?.is_private ? (
          <DeleteChannel
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            userId={channel?.is_private ? user_id : adminId}
            isPrivate={channel?.is_private}
            channelAvatarId={channel?.avatar_id as string}
          />
        ) : null}
        {isUserAMember?.length >= 1 && channel?.is_private ? (
          <DeleteChannel
            channelId={channel?.channel_id}
            groupName={channel?.group_name as string}
            userId={channel?.is_private ? user_id : adminId}
            isPrivate={channel?.is_private}
            channelAvatarId={channel?.avatar_id as string}
          />
        ) : null}
      </div>
    </header>
  );
}

export default Header;
