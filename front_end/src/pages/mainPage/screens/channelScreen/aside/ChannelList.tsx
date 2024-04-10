import { Input } from "@/components/ui/input";
import { useGetUserChannelsQuery } from "@/service/slices/channel/channelApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import ChannelCard from "./channelCard/ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
type Props = {
  handleAside: () => void;
};
export default function ChannelList({ handleAside }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching } = useGetUserChannelsQuery(user_id);

  return (
    <div onClick={handleAside} className="flex flex-col h-[87%] w-full gap-2 ">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Chat</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-primary-foreground h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] overflow-y-auto py-2 px-0 gap-1">
        {isFetching ? (
          <li className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70">
            <div className="overflow-hidden rounded-full w-11 h-11">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex flex-col w-[80%] h-full justify-center gap-2">
              <div className="w-full h-6">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex-1 w-full">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </li>
        ) : data?.length >= 1 ? (
          data.map((c: TChannelData) => {
            return <ChannelCard key={Math.random()} channel={c} />;
          })
        ) : (
          <p>Empty</p>
        )}
      </ul>
    </div>
  );
}
