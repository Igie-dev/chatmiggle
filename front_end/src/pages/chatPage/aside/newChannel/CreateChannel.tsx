/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BtnsLoaderSpinner from "@/components/loader/BtnLoader";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdMutMutation } from "@/service/slices/user/userApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { Plus, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { encryptText } from "@/utils/helper";
import { useCreateChannelMutation } from "@/service/slices/channel/channelApiSlice";
//*This component accept children as a Dialog trigger
//*children props must be button trigger
type Props = {
  children: React.ReactNode;
};
export default function CreateChannel({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [members, setMembers] = useState<TUserData[]>([]);
  const [channelName, setChannelName] = useState("");
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const { userId: currentUserId } = useAppSelector(getCurrentUser);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [getUser, { isLoading }] = useGetUserByIdMutMutation();
  const [mutate, { isLoading: createLoading }] = useCreateChannelMutation();
  useEffect(() => {
    if (!isOpen || members.length >= 1) return;
    (async () => {
      try {
        const res: any = await getUser(currentUserId);
        if (res?.data) {
          const user = res.data as TUserData;
          setMembers((prev) => [...prev, user]);
        }
      } catch (error) {}
    })();
  }, [getUser, isOpen, currentUserId, members]);

  useEffect(() => {
    if (!isOpen) {
      setSearchId("");
      setIsOpenSearch(false);
      setMembers([]);
      setError("");
      setSearchError("");
      setChannelName("");
    }
  }, [isOpen]);

  const handleSeachUser = () => {
    if (!searchId) return;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getUser(searchId);
        if (res?.data) {
          const user = res.data as TUserData;
          const foundExistInMembers = members.filter(
            (m) => m.userId === user.userId
          );
          if (foundExistInMembers.length <= 0) {
            setMembers((prev) => [...prev, user]);
          }
          setSearchId("");
          setIsOpenSearch(false);
        } else {
          setSearchError("User not found");
        }
      } catch (error) {}
    })();
  };

  const handleRemove = (id: string) => {
    if (id === currentUserId) return;
    setMembers((prev) => prev.filter((u) => u.userId !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const groupMembers = members.map((m) => {
      return {
        userId: m.userId,
      };
    });
    const newChannel: TCreateChannel = {
      message: encryptText(message),
      senderId: currentUserId,
      type: "text",
      members: groupMembers,
      channelName: channelName,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await mutate(newChannel);

      if (res?.data) {
        setSearchId("");
        setIsOpenSearch(false);
        setMembers([]);
        setError("");
        setSearchError("");
        setChannelName("");
        setTimeout(() => {
          setIsOpen(false);
        }, 500);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new channel</DialogTitle>
          <DialogDescription>
            Give your channel a name and add members to start collaborating!
          </DialogDescription>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-2 !mt-5 relative"
          >
            <p className="w-full text-sm text-center text-destructive">
              {error}
            </p>
            <h1 className="text-sm font-semibold">Members</h1>
            <div className="flex flex-col w-full px-1 overflow-auto border-b h-fit max-h-[15rem]">
              <ul className="flex flex-col w-full gap-1 py-3 h-fit">
                {isLoading ? (
                  <li className="flex items-center w-full gap-2 p-2 border rounded-md h-fit">
                    <div className="w-10 h-10 ">
                      <Skeleton className="w-full h-full rounded-full " />
                    </div>
                    <div className="h-3 truncate w-[40%] ">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </li>
                ) : members?.length >= 1 ? (
                  members.map((u: TUserData) => {
                    return (
                      <li
                        key={u.userId}
                        className="flex items-center w-full p-2 border rounded-md h-fit"
                      >
                        <div className="flex items-center flex-1 gap-2 ">
                          <div className="w-10 h-10">
                            <DisplayAvatar id={u.avatarId as string} />
                          </div>
                          <p className="text-sm truncate w-[80%]  text-start">
                            {u.firstName + " " + u.lastName}
                          </p>
                        </div>
                        {u.userId !== currentUserId ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(u.userId)}
                          >
                            <X size={20} />
                          </Button>
                        ) : null}
                      </li>
                    );
                  })
                ) : null}

                {isOpenSearch ? (
                  <div className="absolute top-0 left-0 z-10 flex flex-col items-start w-full h-full gap-4 bg-background">
                    <div className="flex items-center justify-between w-full">
                      <label
                        htmlFor="search_id_input"
                        className="text-sm font-semibold"
                      >
                        Search user by ID
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={isLoading}
                        onClick={() => setIsOpenSearch(false)}
                      >
                        {isLoading ? <BtnsLoaderSpinner /> : <X size={20} />}
                      </Button>
                    </div>
                    <div className="flex items-center w-full h-12 gap-2 p-1 overflow-hidden border rounded-md">
                      <input
                        type="text"
                        value={searchId}
                        id="search_id_input"
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 w-full h-full px-2 text-sm bg-transparent outline-none"
                        placeholder="Enter User ID"
                      />
                      <Button
                        size="icon"
                        type="button"
                        disabled={isLoading}
                        onClick={handleSeachUser}
                      >
                        {isLoading ? (
                          <BtnsLoaderSpinner />
                        ) : (
                          <Search size={20} />
                        )}
                      </Button>
                    </div>
                    <p className="w-full text-sm text-center text-destructive">
                      {searchError}
                    </p>
                  </div>
                ) : null}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setIsOpenSearch(true)}
                  className="w-full mt-2"
                >
                  {isLoading ? <BtnsLoaderSpinner /> : <Plus size={20} />}
                </Button>
              </ul>
            </div>
            <div className="flex flex-col w-full gap-1 px-1 mt-5 h-fit">
              <label htmlFor="channelName" className="text-sm font-semibold">
                Channel name
              </label>
              <div className="flex items-center w-full h-12 gap-2 p-1 overflow-hidden border rounded-md">
                <input
                  type="text"
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="flex-1 w-full h-full px-2 text-sm bg-transparent outline-none"
                  placeholder="Enter channel name"
                />
              </div>
              <div className="flex flex-col mt-5">
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[10rem] max-h-[30rem] rounded-md border bg-transparent outline-none p-2 text-sm"
                  placeholder="Messege"
                />
              </div>
            </div>
            <div className="flex h-fit !mt-5 items-center gap-4">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={isLoading || createLoading}
                >
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                size="lg"
                disabled={
                  isLoading || createLoading || members.length <= 0 || !message
                }
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
