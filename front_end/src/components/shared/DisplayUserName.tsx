import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
type Props = {
  userId: string;
};
export default function DisplayUserName({ userId }: Props) {
  const { data, isFetching } = useGetUserByIdQuery(userId);

  return (
    <>
      {isFetching ? (
        <Skeleton className="w-full h-full" />
      ) : !data ? (
        "User"
      ) : (
        <>{`${data?.first_name} ${data?.last_name}`}</>
      )}
    </>
  );
}
