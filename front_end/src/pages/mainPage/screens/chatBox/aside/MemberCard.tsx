import DisplayAvatar from "@/components/shared/DisplayAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";

type Props = {
  userId: string;
};
export default function MemberCard({ userId }: Props) {
  const { data, isFetching, isError } = useGetUserByIdQuery(userId);
  if (isError) return null;
  return isFetching ? (
    <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70">
      <div className="overflow-hidden rounded-full w-11 h-11">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col w-[80%] h-full justify-center gap-2">
        <div className="w-full h-3">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </li>
  ) : (
    <li
      //   onClick={handleClick}
      className={`flex items-center w-full gap-3 p-2 bg-transparent  rounded-md cursor-pointer h-fit hover:shadow-md hover:bg-accent ${
        isFetching ? "hover:cursor-wait" : "hover:cursor-pointer"
      }`}
    >
      <div className="w-9 h-9">
        <DisplayAvatar id={data?.user_id} />
      </div>
      <div className="h-full flex items-center w-[70%]">
        <p className="w-full max-w-full text-sm truncate max-h-6">
          {data?.first_name + " " + data?.last_name}
        </p>
      </div>
    </li>
  );
}
