import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import UserAvatar from "@/components/shared/UserAvatar";
import GroupAvatar from "@/components/shared/GroupAvatar";
import DisplayUserName from "../../channelScreen/aside/channelCard/DisplayUserName";
type Props = {
  handleAside: () => void;
};
export default function Header({ handleAside }: Props) {
  const { channelId } = useParams();
  const { data } = useGetChannelQuery(channelId as string);
  const { user_id } = useAppSelector(getCurrentUser);
  const mate_id =
    data?.members?.length >= 3
      ? ""
      : data?.members[0].user_id !== user_id
      ? data?.members[0].user_id
      : data?.members[1].user_id;
  return (
    <header className="flex items-center justify-between w-full h-20 px-2 border-b lg:w-[98%]">
      <div className="flex items-center flex-1 gap-2 ml-10 lg:ml-0">
        <div className="w-9 h-9">
          {data?.is_private ? (
            <UserAvatar userId={mate_id} />
          ) : (
            <GroupAvatar channelId={data?.channel_id} />
          )}
        </div>
        <div className="w-[12rem] lg:w-[15rem]">
          {data?.is_private ? (
            <span className="w-full text-sm font-medium truncate opacity-90 max-h-6">
              <DisplayUserName userId={mate_id} />
            </span>
          ) : (
            <p className="w-full text-sm font-medium truncate opacity-90 max-h-6">
              {data?.group_name}
            </p>
          )}
        </div>
      </div>
      <div>
        <Button
          onClick={handleAside}
          size="icon"
          variant="ghost"
          className="xl:hidden"
        >
          <EllipsisVertical size={20} />
        </Button>
      </div>
    </header>
  );
}
