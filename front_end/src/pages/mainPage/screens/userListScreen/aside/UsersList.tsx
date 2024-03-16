import { Input } from "@/components/ui/input";
import UsersCard from "./UsersCard";

export default function UsersList() {
	return (
		<div className="flex flex-col w-full h-[85%] gap-2">
			<header className="flex items-center w-full gap-4 h-[8%] px-4 rounded-sm">
				<h1 className="text-sm font-semibold">Users</h1>
				<Input
					type="text"
					placeholder="Search..."
					className="bg-secondary/70"
				/>
			</header>
			<ul className="flex flex-col w-full h-[92%] overflow-y-auto p-2">
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
				<UsersCard />
			</ul>
		</div>
	);
}
