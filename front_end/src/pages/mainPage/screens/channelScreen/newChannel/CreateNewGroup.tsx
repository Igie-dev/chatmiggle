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
import { asyncEmit } from "@/socket";
import { Plus, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
//*This component accept children as a Dialog trigger
//*children props must be button trigger
type Props = {
  children: React.ReactNode;
};
export default function CreateNewGroup({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [members, setMembers] = useState<TUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const { user_id } = useAppSelector(getCurrentUser);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [getUser, { isLoading }] = useGetUserByIdMutMutation();

  useEffect(() => {
    if (!isOpen || members.length >= 1) return;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getUser(user_id);
        if (res?.data) {
          const user = res.data as TUser;
          setMembers((prev) => [...prev, user]);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [getUser, isOpen, user_id, members]);

  useEffect(() => {
    if (!isOpen) {
      setSearchId("");
      setIsOpenSearch(false);
      setMembers([]);
      setError("");
      setSearchError("");
      setGroupName("");
    }
  }, [isOpen]);

  const handleSeachUser = () => {
    if (!searchId) return;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await getUser(searchId);
        if (res?.data) {
          const user = res.data as TUser;
          const foundExistInMembers = members.filter(
            (m) => m.user_id === user.user_id
          );
          if (foundExistInMembers.length <= 0) {
            setMembers((prev) => [...prev, user]);
          }
          setSearchId("");
          setIsOpenSearch(false);
        } else {
          setSearchError("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const handleRemove = (id: string) => {
    if (id === user_id) return;
    setMembers((prev) => prev.filter((u) => u.user_id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const groupMembers = members.map((m) => {
      return {
        user_id: m.user_id,
      };
    });
    const newGroupData: TCreateNewPrivateChannel & { group_name: string } = {
      message: message,
      sender_id: user_id,
      type: "text",
      members: groupMembers,
      group_name: groupName,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("create_group", newGroupData);
      console.log(res?.data);
      if (res?.data) {
        setSearchId("");
        setIsOpenSearch(false);
        setMembers([]);
        setError("");
        setSearchError("");
        setGroupName("");
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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* <DialogTrigger asChild>
        <Button
          variant="secondary"
          title="New chat"
          className="absolute w-12 h-12 p-2 transition-all border rounded-full bg-secondary/50 hover:bg-secondary bottom-4 right-2 hover:scale-105"
        >
          <Plus size={20} />
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription>
            Give your group a name and add members to start collaborating!
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
                  members.map((u: TUser) => {
                    return (
                      <li
                        key={u.user_id}
                        className="flex items-center w-full p-2 border rounded-md h-fit"
                      >
                        <div className="flex items-center flex-1 gap-2 ">
                          <div className="w-10 h-10">
                            <DisplayAvatar id={u.user_id} />
                          </div>
                          <p className="text-sm truncate w-[80%]  text-start">
                            {u.first_name + " " + u.last_name}
                          </p>
                        </div>
                        {u.user_id !== user_id ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemove(u.user_id)}
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
              <label htmlFor="group_name" className="text-sm font-semibold">
                Group Name
              </label>
              <div className="flex items-center w-full h-12 gap-2 p-1 overflow-hidden border rounded-md">
                <input
                  type="text"
                  id="group_name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 w-full h-full px-2 text-sm bg-transparent outline-none"
                  placeholder="Enter group name"
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
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || members.length <= 0 || !message}
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
