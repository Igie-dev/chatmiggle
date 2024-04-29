import { Input } from "@/components/ui/input";
import ChannelCard from "./channelCard/ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";
import { useGetUserChannelsQuery } from "@/service/slices/channel/channelApiSlice";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { socket } from "@/socket";
import { useNavigate, useParams } from "react-router-dom";
type Props = {
  handleAside: () => void;
};
export default function ChannelList({ handleAside }: Props) {
  const [channels, setChannels] = useState<TChannelData[]>([]);
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserChannelsQuery(user_id);
  const { channelId } = useParams();
  const navigate = useNavigate();
  //Handle data from api request
  useEffect(() => {
    if (data?.length >= 1) {
      setChannels(data);
    }
  }, [data]);

  //Handle data from socket when new message was sent
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("channel_message", (res: { data: TChannelData }) => {
      if (!res?.data) return;
      const user = res?.data?.members.filter((m) => m.user_id === user_id);
      if (user.length === 0) return;
      const newChannelId = res?.data?.channel_id;
      //If channels empty, add to latest new channel
      if (channels.length <= 0) {
        const firstChannel = [res.data];
        setChannels(firstChannel);
        return;
      }

      //If channels not empty
      //Check if channel is exist on the list
      const existChannel = channels.filter(
        (c) => c.channel_id === newChannelId
      );
      //if is exist
      //Modified current list to update message
      if (existChannel.length >= 1) {
        const updatedChannels: TChannelData[] = channels.map(
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

        setChannels([...channelLatestMessage, ...channelsOldMessage]);
      } else {
        //Not exist
        //Unshift channel to list
        //Or add the new channel to top
        const newChannel = [res?.data] as TChannelData[];
        setChannels((prev) => [...newChannel, ...prev]);
      }
    });

    socket.on("remove_channel", (res: { data: TChannelData }) => {
      if (res?.data) {
        console.log(res.data);
        const members = res.data?.members;
        const isUserRemove = members.filter(
          (m) => m.user_id === user_id && m.is_deleted
        );

        if (isUserRemove.length === 0) return;
        const channel_id = res.data?.channel_id;
        const channelExist = channels.filter(
          (c) => c.channel_id === channel_id
        );
        if (channelExist.length >= 1) {
          const removeChannel = channels.filter(
            (c) => c.channel_id !== channel_id
          );
          setChannels(removeChannel);
          navigate(`/c/${removeChannel[0].channel_id}`);
        }
      }
    });
    return () => {
      socket.off("channel_message");
      socket.off("remove_channel");
    };
  }, [channels, user_id, navigate]);

  //Handle auto select channel when first visit
  useEffect(() => {
    if (!channelId && channels?.length && channels[0]?.channel_id) {
      navigate(`/c/${channels[0].channel_id}`);
    }
  }, [channelId, channels, navigate]);

  return (
    <div onClick={handleAside} className="flex flex-col h-[87%] w-full gap-2 ">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Chat</h1>
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
            {isError || channels?.length <= 0 ? (
              <div className="flex flex-col items-center w-full mt-5 opacity-60">
                <Library size={30} />
                <p className="text-sm font-semibold">Empty</p>
              </div>
            ) : (
              channels?.map((c: TChannelData) => {
                return <ChannelCard key={c.id} channel={c} />;
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
