import { Button } from "@/components/ui/button";
import { Share, Image, Trash, Copy } from "lucide-react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import ChangeGroupName from "./ChangeGroupName";
import RemoveFromChannel from "./RemoveFromChannel";
import DeleteChannel from "./DeleteChannel";
import CustomTooltip from "@/components/shared/CustomTooltip";
import useListenChangeGroupName from "@/hooks/useListenChangeGroupName";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
function Header() {
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  const [groupName, setGroupName] = useState("");
  const [adminId, setAdminId] = useState("");
  const { channelId } = useParams();
  const { data, isFetching } = useGetChannelQuery(channelId as string);
  const newGroupName = useListenChangeGroupName(channelId as string);

  useLayoutEffect(() => {
    setGroupName(data?.channelName as string);
    if (newGroupName) {
      setGroupName(newGroupName);
    }
  }, [data, newGroupName]);

  useLayoutEffect(() => {
    if (!data?.channelId) return;
    const getAdmin = data?.members.filter(
      (m: TChannelMemberData) => m.joinApproved && m.isAdmin
    );
    if (getAdmin.length >= 1) {
      setAdminId(getAdmin[0].userId);
    }
  }, [data]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(`${data?.channelId}`);
  };
  return (
    <header className="flex flex-col items-center justify-between w-full gap-5 px-5 py-4 h-fit">
      <div className="flex flex-col items-center justify-center w-full space-y-2">
        <div className="overflow-hidden border rounded-full w-14 h-14">
          {isFetching ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <DisplayAvatar id={(data?.avatarId as string) ?? ""} />
          )}
        </div>
        {isFetching ? (
          <div className="w-[70%] h-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <span className="text-sm font-semibold truncate">{groupName}</span>
        )}
      </div>
      <div className="flex items-center justify-center w-full gap-1 ">
        <ChangeGroupName
          channelId={data?.channelId}
          groupName={data?.channelName as string}
          avatarId={data?.avatarId as string}
        />

        <Button size="icon" variant="outline">
          <Link
            to={`/avatar/upload/${data?.channelId}`}
            className="flex !justify-center w-full !px-2"
          >
            <CustomTooltip title="Change profile">
              <Image size={20} />
            </CustomTooltip>
          </Link>
        </Button>

        {adminId !== currentUserId ? (
          <RemoveFromChannel
            userId={currentUserId}
            channelId={data?.channelId}
            channelName={data?.channelName as string}
            cardDescription="Are you sure you want to leave this group?"
            cardTitle="Leave Group"
            type="leave"
            channelAvatarId={data?.avatarId as string}
          >
            <Button size="icon" variant="outline">
              <CustomTooltip title="Leave group">
                <Trash size={20} />
              </CustomTooltip>
            </Button>
          </RemoveFromChannel>
        ) : null}
        {adminId === currentUserId ? (
          <DeleteChannel
            channelId={data?.channelId}
            groupName={data?.channelName as string}
            channelAvatarId={data?.avatarId as string}
            userId={currentUserId}
          />
        ) : null}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <Share size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Copy ID</DialogTitle>
              <DialogDescription>
                Copy your ID and share it with whoever you want to send you a
                message.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="channelId" className="sr-only">
                  ID
                </Label>
                <Input id="channelId" defaultValue={channelId} readOnly />
              </div>
              <Button size="sm" onClick={handleCopyId} className="px-3">
                <span className="sr-only">Copy</span>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

export default Header;
