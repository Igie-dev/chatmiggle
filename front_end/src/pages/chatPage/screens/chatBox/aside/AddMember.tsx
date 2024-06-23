/* eslint-disable no-empty */
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
import { Search, UserRoundPlus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGetUserByIdMutMutation } from "@/service/slices/user/userApiSlice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import CustomTooltip from "@/components/shared/CustomTooltip";
import { useAddToGroupMutation } from "@/service/slices/channel/channelApiSlice";
type Props = {
  channelId: string;
  channelAvatarId: string;
  groupName: string;
};
export default function AddMember({
  channelId,
  groupName,
  channelAvatarId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [newMember, setNewMember] = useState<TUser | null>(null);
  const [getUser, { isLoading: isLoadingGetUser, error: errorGetUser }] =
    useGetUserByIdMutMutation();
  const [mutate, { isLoading: addLoading }] = useAddToGroupMutation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {}
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await mutate({
        user_id: newMember?.user_id as string,
        channel_id: channelId,
      });

      if (res?.data?.channel_id === channelId) {
        setOpen(false);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <CustomTooltip title="Add member">
            <UserRoundPlus size={20} />
          </CustomTooltip>
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
              <DisplayAvatar id={channelAvatarId} />
            </div>
            <span className="w-full font-normal text-center truncate text-medium">
              {groupName}
            </span>
            <p className="text-sm text-destructive">
              {error || errorGetUser?.data?.message}
            </p>
            {newMember ? (
              <div className="flex items-center w-full p-2 border rounded-md bg-accent">
                <div className="flex items-center flex-1 gap-2 ">
                  <div className="w-10 h-10">
                    <DisplayAvatar id={newMember?.avatar_id as string} />
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
                    {isLoadingGetUser || isLoading || addLoading ? (
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
              disabled={isLoadingGetUser || addLoading || !newMember}
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
