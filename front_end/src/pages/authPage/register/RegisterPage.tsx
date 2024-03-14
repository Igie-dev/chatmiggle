import { Outlet } from "react-router-dom";

export default function RegisterPage() {
	return (
		<section className="flex flex-col items-center justify-center w-screen h-screen gap-10 rounded-lg">
			<Outlet />
		</section>
	);
}
