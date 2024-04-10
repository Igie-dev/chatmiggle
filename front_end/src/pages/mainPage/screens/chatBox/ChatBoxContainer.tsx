import { useRef } from "react";
import ChatboxAside from "./aside/ChatboxAside";
import ChatBox from "./chatbox/ChatBox";
import { useVerifyUserInChannelQuery } from "@/service/slices/channel/channelApiSlice";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useParams } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Hand } from "lucide-react";
export default function ChatBoxContainer() {
  const asideRef = useRef<HTMLDivElement | null>(null);
  const { user_id } = useAppSelector(getCurrentUser);
  const { channelId } = useParams();
  const { data, isFetching, isError } = useVerifyUserInChannelQuery({
    channel_id: channelId as string,
    user_id,
  });

  console.log(data);
  console.log(isError);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("translate-x-full")) {
      asideRef?.current?.classList.remove("translate-x-full");
    } else {
      asideRef?.current?.classList.add("translate-x-full");
    }
  };

  return (
    <section className="relative flex items-center w-full h-full gap-2">
      {isFetching ? (
        <LoaderSpinner />
      ) : data?.channel_id && !isError ? (
        <div className="relative flex items-center w-full h-full gap-2 overflow-hidden">
          <ChatBox handleAside={handleAside} channelId={data?.channel_id} />
          <ChatboxAside
            asideRef={asideRef}
            handleAside={handleAside}
            channelId={data?.channel_id}
          />
        </div>
      ) : (
        <div className="flex items-center justify-start w-full h-full pt-[20%] lg:pt-[15%] flex-col gap-1">
          <Hand size={50} className="opacity-70" />
          <p className="mt-2 text-lg font-semibold opacity-70">Unauthorized</p>
          <p className="text-xs opacity-70">
            It appears that you are not allowed to view this conversation
          </p>
        </div>
      )}
    </section>
  );
}
