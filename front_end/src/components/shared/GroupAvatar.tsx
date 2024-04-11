import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import placeHolder from "@/assets/placeholder.jpg";
type Props = {
  channelId: string;
};
export default function GroupAvatar({ channelId }: Props) {
  const data = {
    url: "da",
  };

  const isFetching = true;
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
