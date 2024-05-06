import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdMutMutation } from "@/service/slices/user/userApiSlice";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { asyncEmit } from "@/socket";

//*This component accept children as a Dialog trigger
//*children props must be button trigger
type Props = {
  children: React.ReactNode;
};
export default function CreateNewChannel({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const { user_id } = useAppSelector(getCurrentUser);
  const [getUser, { isLoading }] = useGetUserByIdMutMutation();
  const [mate, setMate] = useState<TUser | null>(null);

  const handleSeachUser = () => {
    if (!id) return;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getUser(id);
        if (res?.data) {
          const user = res.data as TUser;
          setMate(user);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newChannelData: TCreateNewPrivateChannel = {
      message: message,
      sender_id: user_id,
      type: "text",
      members: [{ user_id: mate?.user_id }, { user_id: user_id }],
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("create_new_channel", newChannelData);
      console.log(res?.data);
      if (res?.data) {
        setMessage("");
        setId("");
        setTimeout(() => {
          setIsOpen(false);
        }, 500);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setId("");
      setMate(null);
      setError("");
    }
  }, [isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Private message</DialogTitle>
          <DialogDescription>
            You can send a private message to another user, provided that a
            message is included.
          </DialogDescription>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-2 !mt-5"
          >
            {error ? (
              <div className="w-full text-lg text-center text-destructive">
                {error}
              </div>
            ) : null}
            <div className="flex flex-col items-start w-full gap-1">
              <label htmlFor="id" className="text-sm font-semibold">
                Search user by ID
              </label>
              <div className="flex items-center w-full h-12 gap-2 p-1 overflow-hidden border rounded-md">
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  className="flex-1 w-full h-full px-2 text-sm bg-transparent outline-none"
                  placeholder="Enter User ID"
                />
                <Button size="icon" type="button" onClick={handleSeachUser}>
                  <Search size={20} />
                </Button>
              </div>
            </div>
            <div className="flex items-center w-full h-fit">
              {isLoading ? (
                <div className="flex items-center w-full gap-2 p-2 border rounded-md h-fit">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className=" font-semibold h-4 opacity-70 w-[40%] ">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
              ) : !error && mate?.user_id === user_id ? (
                <div className="flex items-center w-full h-12 px-2">
                  <p className="text-sm ">Please provide other ID</p>
                </div>
              ) : !error && mate?.user_id ? (
                <div className="flex items-center w-full gap-4 p-2 border rounded-md h-fit">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <DisplayAvatar id={mate?.avatar_id as string} />
                  </div>
                  <p className="text-sm  max-w-[70%] truncate">
                    {mate?.first_name + " " + mate?.last_name}
                  </p>
                </div>
              ) : error ? (
                <div className="flex items-center w-full h-12 px-2">
                  <p className="text-sm ">User not found</p>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[10rem] max-h-[30rem] rounded-md border bg-transparent outline-none p-2 text-sm"
                placeholder="Messege"
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
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !id || !mate?.user_id || !message}
              >
                Send
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
