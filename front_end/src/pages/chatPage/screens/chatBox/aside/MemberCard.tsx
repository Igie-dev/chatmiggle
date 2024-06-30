import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { getCurrentChannelAdminId } from "@/service/slices/channel/channelSlice";
import RemoveFromChannel from "./RemoveFromChannel";
type Props = {
  user: TUserData;
};
export default function MemberCard({ user }: Props) {
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
          <p className="text-muted-foreground text-[10px]">
            {adminId === user.userId ? "Admin" : ""}
          </p>
        </div>
      </div>
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
      {userId === adminId && user?.userId !== userId ? (
        <RemoveFromChannel
          cardDescription=" Are you sure you want to remove this user?"
          cardTitle="Remove user"
          user={user}
          type="remove"
        >
          <Button
            size="icon"
            title="Remove"
            variant="ghost"
            className="opacity-50 hover:opacity-100"
          >
            <X size={20} />
          </Button>
        </RemoveFromChannel>
      ) : null}
    </li>
  );
}
