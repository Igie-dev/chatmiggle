import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Link } from "react-router-dom";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { socket } from "@/socket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutBtn from "@/components/shared/SignOutBtn";
import { useEffect } from "react";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Header() {
  const { first_name, last_name, user_id } = useAppSelector(getCurrentUser);
  const { data, isLoading } = useGetUserByIdQuery(user_id);
  const handleCopyId = () => {
    navigator.clipboard.writeText(`${user_id}`);
  };

  useEffect(() => {
    socket.on("connection", () => {
      console.log("socket connected");
    });
    if (user_id) {
      socket.emit("user_join", user_id);
    }
    return () => {
      socket.off("user_join");
    };
  }, [user_id]);
  return (
    <header className="flex items-center justify-center w-full h-[10%] relative border bg-secondary p-2 rounded-md">
      <div className="flex items-center justify-between w-full h-fit">
        <div className="flex items-center w-[80%] h-full gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-10 overflow-hidden border rounded-full h-9">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <DisplayAvatar id={data?.avatar_id} />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[12rem] p-2 text-xs">
              <DropdownMenuLabel className="opacity-70">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={`/profile/${data?.user_id}`}
                  className="w-full cursor-pointer h-9 hover:bg-accent/70"
                >
                  <span className="text-xs">Profile</span>
                </Link>
              </DropdownMenuItem>
              <ModeToggle />
              <DropdownMenuItem asChild>
                <Link
                  to={`/avatar/upload/${user_id}`}
                  className="w-full cursor-pointer h-9 hover:bg-accent/70"
                >
                  <span className="text-xs">Change Avatar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={`/avatar/remove/${user_id}`}
                  className="w-full cursor-pointer h-9 hover:bg-accent/70"
                >
                  <span className="text-xs">Remove Avatar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0 mt-5 hover:bg-transparent h-fit">
                <SignOutBtn />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col w-[80%]">
            <p className="w-full text-sm font-medium truncate">
              {first_name + " " + last_name}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] truncate opacity-70 w-fit max-w-[80%]">
                {"ID: " + user_id}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center w-2 h-2 gap-1 text-[10px] font-light">
                    Copy
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Copy ID</DialogTitle>
                    <DialogDescription>
                      Copy your ID and share it with whoever you want to send
                      you a message.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="userId" className="sr-only">
                        ID
                      </Label>
                      <Input id="userId" defaultValue={user_id} readOnly />
                    </div>
                    <Button size="sm" onClick={handleCopyId} className="px-3">
                      <span className="sr-only">Copy</span>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
