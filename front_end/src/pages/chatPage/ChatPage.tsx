import { Outlet } from "react-router-dom";
import AsideNav from "./aside/AsideNav";

export default function ChatPage() {
	return (
		<section className="relative flex w-screen h-screen">
			<AsideNav />
			<main className="w-full h-full border lg:flex-1 bg-secondary">
				<Outlet />
			</main>
		</section>
	);
}
