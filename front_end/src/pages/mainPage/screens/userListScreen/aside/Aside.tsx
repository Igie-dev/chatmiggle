import Header from "../../components/Header";
export default function AsideNav() {
	return (
		<aside className="absolute top-0 left-0 z-50 w-full h-full bg-secondary/60 lg:static lg:w-[25rem]">
			<div className="flex flex-col h-full w-[22rem] py-5 px-4 bg-background border-r lg:w-full lg:border-none">
				<Header />
				User list
			</div>
		</aside>
	);
}
