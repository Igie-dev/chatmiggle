import Header from "./Header";
import ChannelMembers from "./ChannelMembers";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, X } from "lucide-react";
import RequestJoinList from "./requestJoinChannel/RequestJoinList";

export default function ChatboxAside() {
  const asideRef = useRef<HTMLDivElement | null>(null);
  const [activeList, setActiveList] = useState("memberList");
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("translate-x-full")) {
      asideRef?.current?.classList.remove("translate-x-full");
    } else {
      asideRef?.current?.classList.add("translate-x-full");
    }
  };

  const handleChangeList = (key: string) => {
    setActiveList(key);
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
      <Header />

      <div className="flex items-center w-full gap-1">
        <Button
          size="sm"
          onClick={() => handleChangeList("memberList")}
          variant="ghost"
          className={`w-1/2 ${
            activeList === "memberList" ? "bg-secondary" : "bg-transparent"
          }`}
        >
          Members
        </Button>
        <Button
          size="sm"
          onClick={() => handleChangeList("requestList")}
          variant="ghost"
          className={`w-1/2 ${
            activeList === "requestList" ? "bg-secondary" : "bg-transparent"
          }`}
        >
          Request
        </Button>
      </div>
      <div className="relative flex-1 w-full px-2 pt-5 overflow-auto ">
        {activeList === "memberList" ? <ChannelMembers /> : null}
        {activeList === "requestList" ? <RequestJoinList /> : null}
      </div>
    </aside>
  );
}
