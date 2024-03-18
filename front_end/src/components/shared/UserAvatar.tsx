import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetAvatarLinkQuery } from "@/service/slices/image/imageApiSLice";
import { Skeleton } from "../ui/skeleton";
import placeHolder from "@/assets/placeholder.jpg";
type Props = {
	userId: string;
};
export default function UserAvatar({ userId }: Props) {
	const { data, isFetching } = useGetAvatarLinkQuery(userId);

	return (
		<Avatar className="w-full h-full">
			{isFetching ? (
				<Skeleton className="w-full h-full rounded-full" />
			) : (
				<>
					{data?.url ? (
						<>
							<AvatarImage
								src={data?.url}
								className="object-cover w-full h-full"
							/>
							<AvatarFallback>
								<AvatarImage
									src={placeHolder}
									className="object-cover w-full h-full"
								/>
							</AvatarFallback>
						</>
					) : (
						<AvatarImage
							src={placeHolder}
							className="object-cover w-full h-full"
						/>
					)}
				</>
			)}
		</Avatar>
	);
}
