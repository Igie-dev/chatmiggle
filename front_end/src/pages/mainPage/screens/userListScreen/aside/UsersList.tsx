import { Input } from "@/components/ui/input";
import UsersCard from "./UsersCard";
import { useGetUsersQuery } from "@/service/slices/user/userApiSlice";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
type Props = {
  handleAside: () => void;
};
export default function UsersList({ handleAside }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching } = useGetUsersQuery(0);
  return (
    <div onClick={handleAside} className="flex flex-col w-full h-[87%] gap-2">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Users</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-primary-foreground h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] overflow-y-auto py-2 px-0">
        {isFetching ? (
          <LoadingSkeleton />
        ) : data?.users?.length > 0 ? (
          data?.users
            ?.filter((u: TUser) => u.user_id !== user_id)
            .map((user: TUser) => {
              return <UsersCard key={user.user_id} user={user} />;
            })
        ) : (
          <p>Empty</p>
        )}
      </ul>
    </div>
  );
}
