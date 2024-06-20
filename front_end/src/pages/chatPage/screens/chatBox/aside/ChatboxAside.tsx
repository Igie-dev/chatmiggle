import { useParams } from "react-router-dom";
import Header from "./Header";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import GroupMembers from "./GroupMembers";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, X } from "lucide-react";
export default function ChatboxAside() {
  const asideRef = useRef<HTMLDivElement | null>(null);
  const { channelId } = useParams();
  const { data, isFetching } = useGetChannelQuery(channelId as string);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("translate-x-full")) {
      asideRef?.current?.classList.remove("translate-x-full");
    } else {
      asideRef?.current?.classList.add("translate-x-full");
    }
  };

  return (
    <aside
      ref={asideRef}
      className="h-full flex flex-col p-1 gap-1 z-40 w-full absolute top-0 right-0 xl:static  xl:border-l bg-background xl:translate-x-0 transition-all translate-x-full xl:w-[22rem] 2xl:w-[24rem]"
    >
      <Button
        onClick={handleAside}
        size="icon"
        variant="outline"
        className="absolute -left-12 top-2 bg-accent/70 xl:hidden"
      >
        <EllipsisVertical size={20} />
      </Button>
      <Button
        onClick={handleAside}
        size="icon"
        variant="outline"
        className="absolute right-2 top-2 xl:hidden"
      >
        <X size={20} />
      </Button>
      <Header channel={data} isFetching={isFetching} />
      {data?.channel_id ? (
        <div className="relative flex-1 w-full px-2 pt-5 overflow-auto ">
          <GroupMembers channel={data} />
        </div>
      ) : null}
    </aside>
  );
}
