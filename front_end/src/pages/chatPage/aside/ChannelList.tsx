import ChannelCard from "./channelCard/ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";
import { useGetUserChannelsQuery } from "@/service/slices/channel/channelApiSlice";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { socket } from "@/socket";
import { useNavigate, useParams } from "react-router-dom";
type Props = {
  handleAside: () => void;
  searchText: string;
};
export default function ChannelList({ handleAside, searchText }: Props) {
  const [channels, setChannels] = useState<TChannelData[]>([]);
  const { user_id } = useAppSelector(getCurrentUser);
  const { data, isFetching, isError } = useGetUserChannelsQuery({
    user_id,
    search: searchText,
  });
  const { channelId } = useParams();
  const navigate = useNavigate();
  //Handle data from api request
  useLayoutEffect(() => {
    if (data) {
      setChannels(data);
    } else {
      setChannels([]);
    }
  }, [data]);

  //Handle data from socket when new message was sent
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("channel_message", (res: { data: TChannelData }) => {
      if (!res?.data) return;
      const channel = res?.data as TChannelData;
      if (!channel?.channel_id) return;
      const user = channel?.members.filter((m) => m.user_id === user_id);
      if (user.length === 0) return;
      const newChannelId = channel?.channel_id;
      //If channels empty, add to latest new channel
      if (channels.length <= 0 && channel?.channel_id) {
        setChannels([channel]);
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
            if (c.channel_id === channel?.channel_id) {
              //Update messages data of channel
              const newMessages = channel?.messages;
              //Update members data of channel to desplay channel seen
              const newMembers = channel?.members;

              const newGroupName = channel?.group_name;
              // Update the channel with the new messages array
              return {
                ...c,
                group_name: newGroupName,
                members: newMembers,
                messages: newMessages,
              };
            }
            return c;
          }
        );
        const channelLatestMessage = updatedChannels.filter(
          (c) => c.channel_id === channel?.channel_id
        );
        const channelsOldMessage = updatedChannels.filter(
          (c) => c.channel_id !== channel?.channel_id
        );

        setChannels([...channelLatestMessage, ...channelsOldMessage]);
      } else {
        //Not exist
        //Unshift channel to list
        //Or add the new channel to top
        const newChannel = [channel] as TChannelData[];
        setChannels((prev) => [...newChannel, ...prev]);
      }
    });

    socket.on("remove_channel", (res: { data: TChannelData }) => {
      if (res?.data) {
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
          if (removeChannel.length >= 1) {
            if (channelId === channel_id) {
              navigate(`/c/${removeChannel[0]?.channel_id}`);
            }
          } else {
            navigate("/c");
          }
        }
      }
    });
    return () => {
      socket.off("channel_message");
      socket.off("remove_channel");
    };
  }, [channels, user_id, navigate, channelId]);

  //Handle auto select channel when first visit
  useLayoutEffect(() => {
    if (channels?.length >= 1) {
      if (!channelId) {
        navigate(`/c/${channels[0]?.channel_id}`);
      }
      return;
    }
  }, [channelId, channels, navigate, searchText]);
  return (
    <div className="flex flex-col h-[89%] w-full gap-2 ">
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
                return (
                  <ChannelCard
                    key={c.id}
                    channel={c}
                    handleAside={handleAside}
                  />
                );
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
