import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import { X } from "lucide-react";
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
import { useRemoveUserFromChannelMutation } from "@/service/slices/channel/channelApiSlice";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
type Props = {
  userId: string;
  channelId: string;
  groupName: string;
};
export default function MemberCard({ userId, channelId, groupName }: Props) {
  const [open, setOpen] = useState(false);
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserByIdQuery(userId);
  const [leave, { isLoading, error }] = useRemoveUserFromChannelMutation();
  if (isError) return null;
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await leave({ userId, channelId });
      console.log(res?.data);
      // if (res?.data) {
      //   window.location.reload();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return isFetching ? (
    <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70">
      <div className="overflow-hidden rounded-full w-11 h-11">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col w-[80%] h-full justify-center gap-2">
        <div className="w-full h-3">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </li>
  ) : (
    <li
      //   onClick={handleClick}
      className={`group flex items-center w-full gap-3 p-2 bg-transparent  rounded-md cursor-pointer h-fit hover:shadow-md hover:bg-accent/50 ${
        isFetching ? "hover:cursor-wait" : "hover:cursor-pointer"
      }`}
    >
      <div className="w-10 h-10">
        <DisplayAvatar id={data?.user_id} />
      </div>
      <div className="h-full flex items-center w-[70%]">
        <p className="w-full max-w-full text-sm truncate max-h-6">
          {data?.first_name + " " + data?.last_name}
        </p>
      </div>
      {userId !== user_id ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100"
            >
              <X size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="items-center">
                <DialogTitle>Remove user</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this user?
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
                  {error?.data?.message}
                </p>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <BtnsLoaderSpinner /> : "Remove"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}
    </li>
  );
}
