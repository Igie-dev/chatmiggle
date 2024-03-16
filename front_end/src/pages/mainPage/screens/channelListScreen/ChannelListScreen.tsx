import { Outlet } from "react-router-dom";
import AsideNav from "./aside/Aside";

export default function ChannelListScreen() {
	return (
		<section className="relative flex w-screen h-screen">
			<AsideNav />
			<main className="w-full h-full border lg:flex-1 bg-secondary">
				<Outlet />
			</main>
		</section>
	);
}
