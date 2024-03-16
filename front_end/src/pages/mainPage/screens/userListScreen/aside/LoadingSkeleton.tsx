import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingSkeleton() {
	return (
		<>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
			<li className="relative flex items-center w-full gap-3 px-2 py-3 rounded-md h-fit">
				<Skeleton className="w-10 h-10 border rounded-full " />
				<Skeleton className="h-3 w-[80%]" />
			</li>
		</>
	);
}
