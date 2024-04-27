import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState } from "react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useRemoveUserFromChannelMutation } from "@/service/slices/channel/channelApiSlice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
type Props = {
  channelId: string;
  groupName: string;
};
export default function LeaveGroup({ channelId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  const { user_id } = useAppSelector(getCurrentUser);
  const [leave, { isLoading, error }] = useRemoveUserFromChannelMutation();
  //TODO Send socket to update user channel
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await leave({ userId: user_id, channelId });
      console.log(res?.data);
      // if (res?.data) {
      //   window.location.reload();
      // }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <p>Leave</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center">
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 my-5">
            <div className="w-16 h-16 overflow-hidden border rounded-full">
              <DisplayAvatar id={channelId} />
            </div>
            <span className="w-full font-normal text-center truncate text-medium">
              {groupName}
            </span>
            <p className="text-sm text-destructive">{error?.data?.message}</p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <BtnsLoaderSpinner /> : "Leave"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
