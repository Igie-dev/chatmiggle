import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Link, NavLink } from "react-router-dom";
import { LayoutList, MessageCircleMore, Users } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutBtn from "@/components/shared/SignOutBtn";
export default function Header() {
	const { first_name, user_id } = useAppSelector(getCurrentUser);
	return (
		<header className="flex flex-col w-full h-[15%]">
			<div className="flex items-center justify-between w-full h-16">
				<div className="flex items-center h-full gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="w-9 h-9">
								<UserAvatar userId={user_id} />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="min-w-[12rem] p-2">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="" className="w-full h-10 hover:bg-secondary">
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									to="/avatar/upload"
									className="w-full h-10 hover:bg-secondary">
									Change avatar
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									to="/avatar/remove"
									className="w-full h-10 hover:bg-secondary">
									Remove avatar
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="mt-5" />
							<DropdownMenuItem className="hover:bg-transparent">
								<SignOutBtn />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<p className="text-sm font-semibold">{`${first_name}`}</p>
				</div>
				<ModeToggle />
			</div>
			<nav className="flex items-center w-full h-16 gap-1 py-2 justify-evenly">
				<NavLink
					to="/chat"
					className={({ isActive }) =>
						`flex items-center justify-center flex-1 h-full rounded-md ${
							isActive ? "bg-secondary" : "hover:bg-secondary transition-all"
						}`
					}>
					<MessageCircleMore size={20} />
				</NavLink>
				<NavLink
					to="/g"
					className={({ isActive }) =>
						`flex items-center justify-center flex-1 h-full rounded-md ${
							isActive ? "bg-secondary" : "hover:bg-secondary transition-all"
						}`
					}>
					<LayoutList size={20} />
				</NavLink>
				<NavLink
					to="/u"
					className={({ isActive }) =>
						`flex items-center justify-center flex-1 h-full rounded-md ${
							isActive ? "bg-secondary" : "hover:bg-secondary transition-all"
						}`
					}>
					<Users size={20} />
				</NavLink>
			</nav>
		</header>
	);
}
