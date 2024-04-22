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
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
type Props = {
  channelId: string;
  groupName: string;
};
export default function LeaveGroup({ channelId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  //TODO make user to leave group
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex justify-between w-full px-4"
        >
          <p>Leave</p>
          <ChevronRight size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
