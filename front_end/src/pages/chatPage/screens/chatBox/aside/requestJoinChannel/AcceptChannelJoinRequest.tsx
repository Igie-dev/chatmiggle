import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { useAppSelector } from "@/service/store";
import {
  getCurrentChannelAvatar,
  getCurrentChannelId,
  getCurrentChannelName,
} from "@/service/slices/channel/channelSlice";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAcceptChannelJoinRequestMutation } from "@/service/slices/channel/channelApiSlice";
import { UserRoundPlus } from "lucide-react";

type Props = {
  user: TUserData;
};
export default function AcceptChannelJoinRequest({ user }: Props) {
  const [open, setOpen] = useState(false);
  const channelName = useAppSelector(getCurrentChannelName);
  const channelAvatarId = useAppSelector(getCurrentChannelAvatar);
  const channelId = useAppSelector(getCurrentChannelId);
  const [mutate, { isLoading, error }] = useAcceptChannelJoinRequestMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await mutate({
        channelId: channelId,
        userId: user?.userId,
      });
      if (res?.data) {
        setOpen(false);
      }
    } catch (error) {
      /* empty */
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          title="Profile"
          variant="ghost"
          className="opacity-50 hover:opacity-100"
        >
          <UserRoundPlus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center">
            <DialogTitle>Accept request</DialogTitle>
            <DialogDescription>
              Accept user to join the channel
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 pb-2 my-5 border-b">
            <div className="w-16 h-16 overflow-hidden border rounded-full">
              <DisplayAvatar id={channelAvatarId} />
            </div>
            <span className="w-full font-normal text-center truncate text-medium">
              {channelName}
            </span>

            {user?.firstName && user?.lastName ? (
              <div className="flex items-center w-full gap-4 p-2 mt-5 border rounded-md bg-accent/70 ">
                <div className="w-10 h-10">
                  <DisplayAvatar id={user?.avatarId ?? ""} />
                </div>
                <div className="flex items-center w-[70%] relative">
                  <p className="w-full max-w-full text-sm truncate max-h-6">
                    {user?.firstName + " " + user?.lastName}
                  </p>
                </div>
              </div>
            ) : null}
            <p className="text-sm text-destructive">{error?.message}</p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <BtnsLoaderSpinner /> : "Accept"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
