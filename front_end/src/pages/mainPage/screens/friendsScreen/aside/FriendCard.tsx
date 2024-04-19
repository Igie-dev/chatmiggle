// import { useNavigate, useParams } from "react-router-dom";
import UserAvatar from "@/components/shared/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import { useGetMembersChannelMutation } from "@/service/slices/channel/channelApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { useNavigate } from "react-router-dom";
type Props = {
  user: TChannelMemberData;
};
export default function FriendCard({ user }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserByIdQuery(user.user_id);
  const [getMembersChannel, { isLoading }] = useGetMembersChannelMutation();
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const members: { user_id: string }[] = [
        {
          user_id: data?.user_id,
        },
        {
          user_id: user_id,
        },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await getMembersChannel(members);
      if (res?.data) {
        navigate(`/c/${res.data.channel_id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      onClick={handleClick}
      className={`flex items-center w-full gap-3 p-2 bg-transparent border rounded-md cursor-pointer h-fit hover:shadow-md hover:bg-primary-foreground ${
        isLoading ? "hover:cursor-wait" : "hover:cursor-pointer"
      }`}
    >
      <div className="w-9 h-9">
        <UserAvatar userId={data?.user_id} />
      </div>
      <div className="h-full flex items-center w-[70%]">
        <p className="w-full max-w-full text-sm truncate max-h-6">
          {data?.first_name + " " + data?.last_name}
        </p>
      </div>
    </li>
  );
}
