import { ForwardedRef } from "react";
import Header from "../../../../../components/shared/Header";
import ChannelList from "./ChannelList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewChannelButtons from "@/components/shared/NewChannelButtons";
type Props = {
  handleAside: () => void;
  asideRef: ForwardedRef<HTMLElement | null>;
};
export default function AsideNav({ handleAside, asideRef }: Props) {
  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full bg-background/90  transition-all lg:static lg:translate-x-0 lg:w-[22rem]"
    >
      {/* Close nav button */}
      <Button
        onClick={handleAside}
        size="icon"
        variant="ghost"
        className="absolute z-50 -right-10 top-2 lg:hidden"
      >
        <ChevronRight size={20} />
      </Button>
      <div className="flex flex-col h-full w-[22rem] gap-2 py-5  px-2 bg-background/90 border-r lg:border-none lg:w-full relative ">
        {/* Open nav button */}
        <Button
          onClick={handleAside}
          size="icon"
          variant="ghost"
          className="absolute z-50 right-1 top-2 lg:hidden"
        >
          <ChevronLeft size={20} />
        </Button>
        <Header />
        <ChannelList handleAside={handleAside} />
        <NewChannelButtons />
      </div>
    </aside>
  );
}
