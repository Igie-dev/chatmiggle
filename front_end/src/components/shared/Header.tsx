import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Link, NavLink, useParams } from "react-router-dom";
import { LayoutList, MessageCircleMore } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
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
export default function Header() {
  const { first_name, last_name, user_id } = useAppSelector(getCurrentUser);
  const { channelId } = useParams();

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
    <header className="flex flex-col w-full h-[12%] gap-4 relative">
      <div className="flex items-center justify-between w-full h-fit">
        <div className="flex items-center w-[80%] h-full gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-9 h-9">
                <UserAvatar userId={user_id} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[12rem] p-2 text-xs">
              <DropdownMenuLabel className="opacity-70">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to=""
                  className="w-full h-10 cursor-pointer hover:bg-primary-foreground"
                >
                  <span className="text-sm">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 ">
                <ModeToggle />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to="/avatar/upload"
                  className="w-full h-10 cursor-pointer hover:bg-primary-foreground"
                >
                  <span className="text-sm ">Change avatar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/avatar/remove"
                  className="w-full h-10 cursor-pointer hover:bg-primary-foreground"
                >
                  <span className="text-sm ">Remove avatar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0 mt-5 hover:bg-transparent h-fit">
                <SignOutBtn />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col w-[80%]">
            <p className="w-full text-sm font-semibold truncate">
              {first_name + " " + last_name}
            </p>
            <span className="flex items-center max-w-full gap-1 w-fit">
              <p className="text-[10px] truncate opacity-70 w-[80%]">
                {"ID: " + user_id}
              </p>
              <button
                onClick={handleCopyId}
                className="text-[10px] border py-[1px] px-[5px] rounded-lg opacity-50 hover:opacity-100"
              >
                Copy
              </button>
            </span>
          </div>
        </div>
        {/* <ModeToggle /> */}
      </div>
      <nav className="flex items-center w-full h-10 gap-1 justify-evenly">
        <NavLink
          to={`${channelId?.length ? `/c/${channelId}` : "/c"}`}
          className={({ isActive }) =>
            `flex items-center justify-center border flex-1 h-full rounded-md ${
              isActive
                ? "bg-primary-foreground border-border"
                : "hover:bg-primary-foreground transition-all border-transparent"
            }`
          }
        >
          <MessageCircleMore size={20} className="opacity-70" />
        </NavLink>
        <NavLink
          to={`${channelId?.length ? `/g/${channelId}` : "/g"}`}
          className={({ isActive }) =>
            `flex items-center justify-center  border flex-1 h-full rounded-md ${
              isActive
                ? "bg-primary-foreground border-border"
                : "hover:bg-primary-foreground transition-all border-transparent"
            }`
          }
        >
          <LayoutList size={20} className="opacity-70" />
        </NavLink>
      </nav>
    </header>
  );
}
