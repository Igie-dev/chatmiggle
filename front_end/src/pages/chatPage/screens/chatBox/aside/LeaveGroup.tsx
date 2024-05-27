import { FormEvent, ReactNode, useState } from "react";
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
import { asyncEmit } from "@/socket";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
type Props = {
  userId: string;
  channelId: string;
  channelAvatarId: string;
  groupName: string;
  children: ReactNode;
  cardDescription: string;
  cardTitle: string;
  firstName?: string;
  lastName?: string;
  type: "leave" | "remove";
  userAvatarId?: string;
};
export default function LeaveGroup({
  userId,
  channelId,
  groupName,
  children,
  cardDescription,
  cardTitle,
  lastName,
  firstName,
  type,
  channelAvatarId,
  userAvatarId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("leave_group", {
        channel_id: channelId,
        user_id: userId,
        type,
      });
      if (res?.data.channel_id === channelId) {
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="items-center">
            <DialogTitle>{cardTitle}</DialogTitle>
            <DialogDescription>{cardDescription}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-2 pb-2 my-5 border-b">
            <div className="w-16 h-16 overflow-hidden border rounded-full">
              <DisplayAvatar id={channelAvatarId} />
            </div>
            <span className="w-full font-normal text-center truncate text-medium">
              {groupName}
            </span>

            {firstName && lastName ? (
              <div className="flex items-center w-full gap-4 p-2 mt-5 border rounded-md bg-accent/70 ">
                <div className="w-10 h-10">
                  <DisplayAvatar id={userAvatarId ?? ""} />
                </div>
                <div className="flex items-center w-[70%] relative">
                  <p className="w-full max-w-full text-sm truncate max-h-6">
                    {firstName + " " + lastName}
                  </p>
                </div>
              </div>
            ) : null}
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
