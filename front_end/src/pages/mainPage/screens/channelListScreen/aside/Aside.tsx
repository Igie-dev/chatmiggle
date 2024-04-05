import { ForwardedRef } from "react";
import Header from "../../../../../components/shared/Header";
import ChannelList from "./ChannelList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  handleAside: () => void;
  asideRef: ForwardedRef<HTMLElement | null>;
};
export default function AsideNav({ handleAside, asideRef }: Props) {
  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full bg-primary-forground/50  transition-all lg:static lg:translate-x-0 lg:w-[22rem]"
    >
      <div className="flex flex-col h-full w-[20rem] gap-2 py-5 px-4 bg-background/50 border-r lg:w-full relative lg:border-none">
        <Header />
        <ChannelList handleAside={handleAside} />
        <Button
          variant="secondary"
          title="New chat"
          className="absolute w-12 h-12 p-2 transition-all border rounded-full bg-secondary/50 hover:bg-secondary bottom-4 right-2 hover:scale-105"
        >
          <Plus size={20} />
        </Button>
      </div>
    </aside>
  );
}
