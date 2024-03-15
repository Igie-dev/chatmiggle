import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
	const { first_name } = useAppSelector(getCurrentUser);

	return (
		<header className="flex items-center justify-between w-full h-20">
			<div className="flex items-center h-full gap-2">
				<Avatar className="w-9 h-9">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<p className="text-sm font-semibold">{`${first_name}`}</p>
			</div>
			<ModeToggle />
		</header>
	);
}
