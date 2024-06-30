import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRequestJoinChannelMutation } from "@/service/slices/channel/channelApiSlice";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
type Props = {
  children: React.ReactNode;
};

export default function RequestJoinChannel({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mutate, { isLoading, error }] = useRequestJoinChannelMutation();
  const { userId } = useAppSelector(getCurrentUser);
  const [channelId, setChannelId] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await mutate({ channelId: channelId as string, userId });
      if (res?.data) {
        setChannelId("");
        setIsOpen(false);
      }
    } catch (erroro) {
      console.log(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Joinn channel</DialogTitle>
          <DialogDescription>
            Join channel and collaborate with other members
          </DialogDescription>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-2 !mt-5 relative"
          >
            <p className="w-full text-sm text-center text-destructive">
              {error}
            </p>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="channelId">Channel ID</Label>
              <Input
                id="channelId"
                type="text"
                autoFocus
                placeholder="Enter channel ID"
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
            <div className="flex h-fit !mt-5 items-center gap-4">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogTrigger>
              <Button type="submit" size="lg" disabled={isLoading}>
                Send
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
