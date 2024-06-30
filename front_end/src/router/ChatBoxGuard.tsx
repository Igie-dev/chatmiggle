import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { Hand } from "lucide-react";
import { Outlet, useParams } from "react-router-dom";
export default function ChatBoxGuard() {
  const { userId } = useAppSelector(getCurrentUser);
  const { channelId } = useParams();
  const { data, isFetching, isError, error } = useGetChannelQuery(channelId!);
  return isFetching ? (
    <LoaderSpinner />
  ) : data?.members.filter((m: TUserData) => m.userId === userId) &&
    !isError ? (
    <Outlet />
  ) : (
    <div className="flex items-center justify-start w-full h-full pt-[20%] lg:pt-[15%] flex-col gap-1">
      <Hand size={50} className="opacity-70" />
      <p className="mt-2 text-lg font-semibold opacity-70">
        {error?.data?.error ?? "Unauthorize"}
      </p>
      <p className="text-xs opacity-70">
        It appears that you are not allowed to view this conversation
      </p>
    </div>
  );
}
