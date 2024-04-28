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
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { asyncEmit } from "@/socket";
type Props = {
  channelId: string;
  groupName: string;
};
export default function LeaveGroup({ channelId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  const { user_id } = useAppSelector(getCurrentUser);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //TODO Send socket to update user channel
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("leave_group", {
        channel_id: channelId,
        user_id,
      });
      if (res?.data.channel_id === channelId) {
        setOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
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
            <p className="text-sm text-destructive">{error}</p>
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
