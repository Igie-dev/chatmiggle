import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import DisplayUserName from "@/components/shared/DisplayUserName";
import { Skeleton } from "@/components/ui/skeleton";
type Props = {
  handleAside: () => void;
  channel: TChannelData;
  isFetching: boolean;
};

function Header({ handleAside, channel, isFetching }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const mate = channel?.members.filter((m) => m.user_id !== user_id);
  return (
    <header className="flex items-center justify-between w-full h-fit  px-5 flex-col pt-4  lg:w-[98%]">
      <div className="flex items-center justify-end w-full xl:hidden">
        <Button onClick={handleAside} size="icon" variant="ghost">
          <X size={20} />
        </Button>
      </div>
      <div className="flex items-center w-full gap-4 pb-8 mt-10 border-b">
        <div className="w-16 h-16 overflow-hidden border rounded-full">
          {isFetching ? (
            <Skeleton className="w-full h-full" />
          ) : channel && channel?.is_private ? (
            <DisplayAvatar id={mate[0]?.user_id} />
          ) : (
            <DisplayAvatar id={channel?.channel_id} />
          )}
        </div>
        {isFetching ? (
          <div className="w-[70%] h-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <span className="text-medium font-normal  w-[70%] truncate">
            {channel && channel?.is_private ? (
              <DisplayUserName userId={mate[0]?.user_id} />
            ) : (
              channel?.group_name
            )}
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
