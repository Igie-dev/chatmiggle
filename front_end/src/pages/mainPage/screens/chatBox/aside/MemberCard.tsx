import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import { X } from "lucide-react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import LeaveGroup from "./LeaveGroup";
type Props = {
  userId: string;
  channelId: string;
  channelAvatarId: string;
  groupName: string;
  isPrivate: boolean;
  adminId: string;
};
export default function MemberCard({
  userId,
  channelId,
  groupName,
  isPrivate,
  adminId,
  channelAvatarId,
}: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserByIdQuery(userId);

  console.log(data);
  if (isError) return null;
  return isFetching ? (
    <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70">
      <div className="overflow-hidden rounded-full w-11 h-11">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col w-[80%] h-full justify-center gap-2">
        <div className="w-full h-3">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </li>
  ) : (
    <li
      //   onClick={handleClick}
      className={`group relative flex items-center w-full gap-3 p-2 bg-transparent  rounded-md cursor-pointer h-14 hover:shadow-md hover:bg-accent/50 ${
        isFetching ? "hover:cursor-wait" : "hover:cursor-pointer"
      }`}
    >
      <div className="w-10 h-10">
        <DisplayAvatar id={data?.avatar_id as string} />
      </div>
      <div className="flex items-center w-[70%] relative">
        <p className="w-full max-w-full text-sm truncate max-h-6">
          {data?.first_name + " " + data?.last_name}
        </p>
        <p className="absolute -bottom-4 opacity-50 left-1 text-[10px]">
          {adminId === userId ? "Admin" : ""}
        </p>
      </div>
      {userId !== user_id && !isPrivate && adminId === user_id ? (
        <LeaveGroup
          userId={userId}
          channelId={channelId}
          groupName={groupName}
          cardDescription=" Are you sure you want to remove this user?"
          cardTitle="Remove user"
          firstName={data?.first_name}
          lastName={data?.last_name}
          channelAvatarId={channelAvatarId}
          type="remove"
          userAvatarId={data?.avatar_id as string}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute opacity-0 group-hover:opacity-100 right-2"
          >
            <X size={20} />
          </Button>
        </LeaveGroup>
      ) : null}
    </li>
  );
}
