import ChannelCard from "./channelCard/ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Library } from "lucide-react";
import { useGetUserChannelsQuery } from "@/service/slices/channel/channelApiSlice";
import { useLayoutEffect, useMemo } from "react";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import useListenNewMessage from "@/hooks/useListenNewMessage";
import useListenLeaveGroup from "@/hooks/useListenLeaveGroup";
import useListenRemoveUserFromGroup from "@/hooks/useListenRemoveUserFromGroup";

//TODO
//* Debug here tommorrow

type Props = {
  handleAside: () => void;
  searchText: string;
};
export default function ChannelList({ handleAside, searchText }: Props) {
  const { user_id } = useAppSelector(getCurrentUser);
  const newMessage = useListenNewMessage();
  const { channelId: removedChannelId, userId: removeUserId } =
    useListenRemoveUserFromGroup();

  const { channelId: leaveGroupChannelId, userId: leaveGroupUserId } =
    useListenLeaveGroup();

  const { data, isFetching, isError } = useGetUserChannelsQuery({
    user_id,
    search: searchText,
  });
  const { channelId } = useParams();
  const navigate = useNavigate();
  //Handle data from api request

  const channels = useMemo((): TChannelData[] => {
    let channels: TChannelData[] = [];
    //Inital channels
    if (channels.length <= 0 && data?.length >= 1) {
      channels = data;
    }

    //New message
    if (newMessage) {
      const newChannelId = newMessage.channel_id;
      const messageId = newMessage.messages[0].message_id;

      //If channels not empty
      //Check if channel is exist on the list
      const existChannel = channels.filter(
        (c) => c.channel_id === newChannelId
      );

      //if is exist
      //Modified current list to update message
      if (existChannel.length >= 1) {
        const existMessage =
          existChannel[0]?.messages.filter(
            (msg) => msg.message_id === messageId
          ).length > 0;

        if (!existMessage) {
          const updatedChannels: TChannelData[] = channels.map(
            (c: TChannelData) => {
              if (c.channel_id === newChannelId) {
                //Update messages data of channel
                const newMessages = newMessage?.messages;
                //Update members data of channel to desplay channel seen
                const newMembers = newMessage?.members;

                const newGroupName = newMessage?.group_name;
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
            (c) => c.channel_id === newChannelId
          );

          const removeOld = channels.filter(
            (c) => c.channel_id !== channelLatestMessage[0].channel_id
          );

          channels = [...channelLatestMessage, ...removeOld];
        }
      } else {
        //Not exist
        //Unshift channel to list
        //Or add the new channel to top
        channels = [{ ...newMessage }, ...channels];
      }
    }

    //Remove from channel
    if (removeUserId === user_id) {
      const checkChannelExist = channels.filter(
        (c) => c.channel_id === removedChannelId
      );
      if (checkChannelExist.length >= 1) {
        const newChannels = channels.filter(
          (c) => c.channel_id !== removedChannelId
        );
        channels = newChannels;
        removeChannelNavigate(removedChannelId);
      }
    }

    //Leave channel
    if (leaveGroupChannelId && leaveGroupUserId) {
      const channelExist = channels.filter(
        (c) => c.channel_id === leaveGroupChannelId
      );
      if (channelExist.length >= 1) {
        const removeChannel = channels.filter(
          (c) => c.channel_id !== leaveGroupChannelId
        );
        channels = removeChannel;
        removeChannelNavigate(leaveGroupChannelId);
      }
    }

    //Navigate if channel in first list
    function removeChannelNavigate(compareId: string) {
      if (channels.length >= 1) {
        if (channelId === compareId) {
          navigate(`/c/${channels[0]?.channel_id}`);
        }
      } else {
        navigate("/c");
      }
    }

    return channels;
  }, [
    data,
    removeUserId,
    user_id,
    removedChannelId,
    channelId,
    leaveGroupChannelId,
    navigate,
    newMessage,
    leaveGroupUserId,
  ]);

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
    <div className="flex flex-col h-[82%] w-full gap-2 overflow-y-auto">
      <ul className="flex flex-col w-full h-fit  gap-[2px]  px-0">
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
        className="flex items-center w-full gap-3 p-2 cursor-pointer h-fit border-border/70"
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
