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
import { ChevronRight, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetUserByIdMutMutation } from "@/service/slices/user/userApiSlice";
import { useAddUserToChannelMutation } from "@/service/slices/channel/channelApiSlice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
type Props = {
  channelId: string;
  groupName: string;
};
export default function AddMember({ channelId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [newMember, setNewMember] = useState<TUpdateUser | null>(null);
  const [getUser, { isLoading: isLoadingGetUser, error: errorGetUser }] =
    useGetUserByIdMutMutation();
  const [addUserToChannel, { isLoading, error }] =
    useAddUserToChannelMutation();
  //TODO Add new member

  useEffect(() => {
    if (!open) {
      setUserId("");
      setNewMember(null);
    }
  }, [open]);
  const handleSearch = async () => {
    if (!userId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await getUser(userId);
      if (res.data) {
        setNewMember(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await addUserToChannel({
        userId: newMember?.user_id as string,
        channelId: channelId,
      });
      console.log(res);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex justify-between w-full px-4"
        >
          <p>Add member</p>
          <ChevronRight size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center">
            <DialogTitle>Add Member</DialogTitle>
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
            <p className="text-sm text-destructive">
              {error?.data?.message || errorGetUser?.data?.message}
            </p>
            {newMember ? (
              <div className="flex items-center w-full p-2 border rounded-md bg-accent">
                <div className="flex items-center flex-1 gap-2 ">
                  <div className="w-10 h-10">
                    <DisplayAvatar id={newMember.user_id} />
                  </div>
                  <p className="text-sm truncate w-[80%]  text-start">
                    {newMember.first_name + " " + newMember.last_name}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setNewMember(null);
                    setUserId("");
                  }}
                >
                  <X size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-1">
                <Label htmlFor="user_id">User ID</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="user_id"
                    placeholder="Enter user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    disabled={isLoadingGetUser}
                    onClick={handleSearch}
                    size="icon"
                  >
                    {isLoadingGetUser || isLoading ? (
                      <BtnsLoaderSpinner />
                    ) : (
                      <Search size={20} />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoadingGetUser || !newMember}
              className="w-full"
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
