import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Link, NavLink, useParams } from "react-router-dom";
import { LayoutList, MessageCircleMore } from "lucide-react";
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
                <DisplayAvatar id={user_id} />
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
                  className="w-full h-10 cursor-pointer hover:bg-accent/70"
                >
                  <span className="text-xs">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 ">
                <ModeToggle />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to={`/avatar/upload/${user_id}`}
                  className="w-full h-10 cursor-pointer hover:bg-accent/70"
                >
                  <span className="text-xs">Change Avatar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={`/avatar/remove/${user_id}`}
                  className="w-full h-10 cursor-pointer hover:bg-accent/70"
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
      </div>
      <nav className="flex items-center w-full h-10 gap-1 justify-evenly">
        <NavLink
          to={`${channelId?.length ? `/c/${channelId}` : "/c"}`}
          className={({ isActive }) =>
            `flex items-center justify-center border flex-1 h-full rounded-md ${
              isActive
                ? "bg-accent/70 border-border"
                : "hover:bg-accent/70 transition-all border-transparent"
            }`
          }
        >
          <MessageCircleMore size={20} className="opacity-70" />
        </NavLink>
        <NavLink
          to={`${channelId?.length ? `/f/${channelId}` : "/f"}`}
          className={({ isActive }) =>
            `flex items-center justify-center  border flex-1 h-full rounded-md ${
              isActive
                ? "bg-accent/70 border-border"
                : "hover:bg-accent/70 transition-all border-transparent"
            }`
          }
        >
          <LayoutList size={20} className="opacity-70" />
        </NavLink>
      </nav>
    </header>
  );
}
