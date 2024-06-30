import LoaderSpinner from "@/components/loader/LoaderSpinner";
import ChatboxAside from "./aside/ChatboxAside";
import ChatBox from "./chatbox/ChatBox";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/service/store";
import { setCurrentChannel } from "@/service/slices/channel/channelSlice";
export default function ChatBoxContainer() {
  const { channelId } = useParams();
  const { data, isFetching } = useGetChannelQuery(channelId as string);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.channelId) {
      const dataChannelId = data?.channelId;
      const admin = data?.members?.filter(
        (member: TChannelMemberData) => member.isAdmin
      );
      const members = data?.members;
      dispatch(
        setCurrentChannel({
          channelId: dataChannelId,
          adminId: admin[0]?.userId ?? "",
          members,
          avatarId: data?.avatarId ?? "",
          channelName: data?.channelName ?? "",
        })
      );
    }
  }, [data, dispatch]);

  if (isFetching) return <LoaderSpinner />;

  return (
    <section className="relative flex items-center w-full h-full gap-2">
      <div className="relative flex items-center w-full h-full overflow-hidden">
        <ChatBox />
        <ChatboxAside />
      </div>
    </section>
  );
}
