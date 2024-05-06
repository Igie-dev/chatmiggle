import { FormEvent, useEffect, useState } from "react";
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
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { asyncEmit } from "@/socket";
import { PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import CustomTooltip from "@/components/shared/CustomTooltip";
type Props = {
  channelId: string;
  avatarId: string;
  groupName: string;
};
export default function ChangeGroupName({
  channelId,
  avatarId,
  groupName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const { user_id } = useAppSelector(getCurrentUser);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("change_group_name", {
        channelId,
        name: newGroupName,
        userId: user_id,
      });
      if (res?.data) {
        setOpen(false);
      }
    } catch (error) {
      setErrMsg("Failed to change name");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNewGroupName(groupName);
    if (!open) {
      setNewGroupName("");
    }
    return () => {
      setNewGroupName("");
    };
  }, [groupName, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-background">
          <CustomTooltip title="Change group name">
            <PencilLine size={20} />
          </CustomTooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center">
            <DialogTitle>Change group name</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this group name
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 my-5">
            <div className="w-16 h-16 overflow-hidden border rounded-full">
              <DisplayAvatar id={avatarId} />
            </div>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full text-center border-t-0 border-b border-l-0 border-r-0 rounded-none"
            />
          </div>
          <p className="text-sm text-destructive">{errMsg}</p>
          <DialogFooter className="mt-10">
            <Button
              type="submit"
              disabled={
                isLoading || groupName === newGroupName || !newGroupName
              }
              className="w-full"
            >
              {isLoading ? <BtnsLoaderSpinner /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
