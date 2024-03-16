import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { LayoutList, MessageCircleMore, Users } from "lucide-react";
export default function Header() {
	const { first_name } = useAppSelector(getCurrentUser);

	return (
		<header className="flex flex-col w-full h-[15%]">
			<div className="flex items-center justify-between w-full h-16">
				<div className="flex items-center h-full gap-2">
					<Avatar className="w-9 h-9">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
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
