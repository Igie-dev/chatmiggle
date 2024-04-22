import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserFriendsQuery } from "@/service/slices/user/userApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { Library } from "lucide-react";
import FriendCard from "./FriendCard";
type Props = {
  handleAside: () => void;
};
export default function FriendsList({ handleAside }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const {
    data: friends,
    isFetching,
    isError,
  } = useGetUserFriendsQuery(user_id);

  return (
    <div onClick={handleAside} className="flex flex-col w-full h-[87%] gap-2">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Friends</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-accent/70 h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] gap-[2px] overflow-y-auto py-2 px-0">
        {isFetching ? (
          <LoaderUi />
        ) : (
          <>
            {isError || friends?.length <= 0 ? (
              <div className="flex flex-col items-center w-full mt-5 opacity-60">
                <Library size={30} />
                <p className="text-sm font-semibold">Empty</p>
              </div>
            ) : (
              friends?.map((m: TChannelMemberData) => {
                return <FriendCard key={m.id} user={m} />;
              })
            )}
          </>
        )}
      </ul>
    </div>
  );
}

const LoaderUi = () => {
  const loader = [];
  for (let i = 0; i < 5; i++) {
    loader.push(
      <li
        key={i}
        className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70"
      >
        <div className="overflow-hidden rounded-full w-11 h-11">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex flex-col w-[80%] h-full justify-center gap-2">
          <div className="w-full h-3">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </li>
    );
  }
  return loader;
};
