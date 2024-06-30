import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { getCurrentChannelAdminId } from "@/service/slices/channel/channelSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AcceptChannelJoinRequest from "./AcceptChannelJoinRequest";
type Props = {
  user: TUserData;
};
export default function RequestJoinCard({ user }: Props) {
  const navigate = useNavigate();
  const { userId } = useAppSelector(getCurrentUser);
  const adminId = useAppSelector(getCurrentChannelAdminId);
  return (
    <li className="relative flex items-center justify-between w-full gap-1 p-2 bg-transparent rounded-md cursor-pointer group h-fit hover:bg-secondary/50">
      <div className="flex items-center flex-1 h-full gap-2">
        <div className="w-8 h-8">
          <DisplayAvatar id={user?.avatarId as string} />
        </div>
        <div className="items-start w-[75%]  flex flex-col">
          <p className="w-full max-w-full text-xs truncate max-h-6">
            {user?.firstName + " " + user?.lastName}
          </p>
        </div>
      </div>
      {userId === adminId ? <AcceptChannelJoinRequest user={user} /> : null}
      {user?.userId !== userId ? (
        <Button
          size="icon"
          title="Profile"
          variant="ghost"
          onClick={() => navigate(`/profile/${user?.userId}`)}
          className="opacity-50 hover:opacity-100"
        >
          <User size={20} />
        </Button>
      ) : null}
    </li>
  );
}
