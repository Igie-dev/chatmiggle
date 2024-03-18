import { Ellipsis } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
type Props = {
	user: TUser;
};
export default function UsersCard({ user }: Props) {
	return (
		<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md cursor-pointer hover:bg-secondary/70 h-fit">
			<div className="w-10 h-10 rounded-full">
				<UserAvatar userId={user.user_id} />
			</div>
			<p className="text-sm font-semibold  w-[70%] truncate">
				{user?.first_name + " " + user?.last_name}
			</p>
			<button className="absolute flex items-center justify-center w-10 h-10 transition-all border rounded-full opacity-50 right-2 hover:opacity-100">
				<Ellipsis />
			</button>
		</li>
	);
}
