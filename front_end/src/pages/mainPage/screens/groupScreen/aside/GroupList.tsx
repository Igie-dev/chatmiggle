import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserGroupsQuery } from "@/service/slices/channel/channelApiSlice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { Library } from "lucide-react";
import { useEffect, useState } from "react";
import ChannelCard from "../../channelScreen/aside/channelCard/ChannelCard";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "@/socket";
type Props = {
  handleAside: () => void;
};
export default function GroupList({ handleAside }: Props) {
  const [groups, setGroups] = useState<TChannelData[]>([]);
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserGroupsQuery(user_id);
  const { channelId } = useParams();
  const navigate = useNavigate();
  //Handle data from api request
  useEffect(() => {
    if (data?.length >= 1) {
      setGroups(data);
    }
  }, [data]);

  //Handle data from socket when new message was sent
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("channel_message", (res: { data: TChannelData }) => {
      const user = res?.data?.members.filter((m) => m.user_id === user_id);

      if (!res?.data || !res.data?.channel_id || user.length <= 0) return;
      //If groups empty, add to latest new groups
      if (groups.length <= 0) {
        const firstChannel = [res.data];
        setGroups(firstChannel);
        return;
      }
      //If channels not empty
      //Check if channel is exist on the list
      const foundExistChannel = groups.filter(
        (c) => c.channel_id === res.data?.channel_id
      );
      //if is exist
      //Modified current list to update message
      if (foundExistChannel.length >= 1) {
        const updatedChannels: TChannelData[] = groups.map(
          (c: TChannelData) => {
            if (c.channel_id === res.data?.channel_id) {
              //Update messages data of channel
              const newMessages = res.data?.messages;
              //Update members data of channel to desplay channel seen
              const newMembers = res.data?.members;
              // Update the channel with the new messages array
              return { ...c, members: newMembers, messages: newMessages };
            }
            return c;
          }
        );
        const channelLatestMessage = updatedChannels.filter(
          (c) => c.channel_id === res.data?.channel_id
        );
        const channelsOldMessage = updatedChannels.filter(
          (c) => c.channel_id !== res.data?.channel_id
        );

        setGroups([...channelLatestMessage, ...channelsOldMessage]);
      } else {
        //Not exist
        //Unshift channel to list
        //Or add the new channel to top
        const newChannel = [res?.data] as TChannelData[];
        setGroups((prev) => [...newChannel, ...prev]);
      }
    });

    return () => {
      socket.off("channel_message");
    };
  }, [groups, user_id]);

  useEffect(() => {
    if (!channelId && groups?.length && groups[0]?.channel_id) {
      navigate(`/g/${groups[0].channel_id}`);
    }
  }, [channelId, groups, navigate]);

  return (
    <div onClick={handleAside} className="flex flex-col w-full h-[87%] gap-2">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Group</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-primary-foreground h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] gap-[2px] overflow-y-auto py-2 px-0">
        {isFetching ? (
          <LoaderUi />
        ) : groups?.length > 0 && !isError ? (
          groups.map((c: TChannelData) => {
            return <ChannelCard key={c.id} channel={c} />;
          })
        ) : (
          <div className="flex flex-col items-center w-full mt-5">
            <Library size={30} className="opacity-70" />
            <p className="text-sm font-semibold opacity-70">Empty</p>
          </div>
        )}
      </ul>
    </div>
  );
}

const LoaderUi = () => {
  const loader = [];
  for (let i = 0; i < 3; i++) {
    loader.push(
      <li
        key={i}
        className="flex items-center w-full gap-3 p-2 border rounded-md cursor-pointer h-fit border-border/70"
      >
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
    );
  }
  return loader;
};
