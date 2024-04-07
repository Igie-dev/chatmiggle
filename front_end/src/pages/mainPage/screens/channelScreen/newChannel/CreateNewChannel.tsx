import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import UserAvatar from "@/components/shared/UserAvatar";
export default function CreateNewChannel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const { data, isFetching, isError, refetch } = useGetUserByIdQuery(id);

  const handleSeachUser = () => {
    if (inputRef?.current?.value) {
      setId(inputRef?.current?.value);
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          title="New chat"
          className="absolute w-12 h-12 p-2 transition-all border rounded-full bg-secondary/50 hover:bg-secondary bottom-4 right-2 hover:scale-105"
        >
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Private message</DialogTitle>
          <DialogDescription>
            You can send a private message to another user, provided that there
            is a message included.
          </DialogDescription>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-2 !mt-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="id" className="text-sm font-semibold">
                Search user by ID
              </label>
              <div className="flex items-center w-full h-12 gap-2 p-1 overflow-hidden border rounded-md">
                <input
                  ref={inputRef}
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
              {isFetching ? (
                <div className="flex items-center w-full gap-2 p-2 border rounded-md h-fit">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className=" font-semibold h-4 opacity-70 w-[40%] ">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
              ) : !isError && data && data?.user_id ? (
                <div className="flex items-center w-full gap-4 p-2 border rounded-md h-fit">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <UserAvatar userId={data?.user_id} />
                  </div>
                  <p className="text-sm opacity-70 max-w-[70%] truncate">
                    {data?.first_name + " " + data?.last_name}
                  </p>
                </div>
              ) : isError ? (
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
                  disabled={isFetching}
                >
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                size="lg"
                disabled={isFetching || !id || !data?.user_id || !message}
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
