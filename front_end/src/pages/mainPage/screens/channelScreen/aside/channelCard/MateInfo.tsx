import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/service/slices/user/userApiSlice";
type Props = {
  user_id: string;
};
export default function MateInfo({ user_id }: Props) {
  const { data, isFetching } = useGetUserByIdQuery(user_id);
  return (
    <>
      {isFetching ? (
        <div className="w-full h-5">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <p className="w-full max-w-full text-sm font-semibold truncate opacity-90 max-h-6">{`${data?.first_name} ${data?.last_name}`}</p>
      )}
    </>
  );
}
