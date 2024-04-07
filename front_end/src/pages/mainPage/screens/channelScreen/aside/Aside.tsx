import { ForwardedRef } from "react";
import Header from "../../../../../components/shared/Header";
import ChannelList from "./ChannelList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateNewChannel from "../newChannel/CreateNewChannel";
type Props = {
  handleAside: () => void;
  asideRef: ForwardedRef<HTMLElement | null>;
};
export default function AsideNav({ handleAside, asideRef }: Props) {
  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full bg-background/90  transition-all lg:static lg:translate-x-0 lg:w-[20rem]"
    >
      {/* Close nav button */}
      <Button
        onClick={handleAside}
        size="icon"
        variant="outline"
        className="absolute -right-12 top-5 lg:hidden"
      >
        <ChevronRight size={20} />
      </Button>
      <div className="flex flex-col h-full w-[22rem] gap-2 py-5  px-4 bg-background/50  lg:w-full relative ">
        {/* Open nav button */}
        <Button
          onClick={handleAside}
          size="icon"
          variant="outline"
          className="absolute z-50 right-1 top-5 lg:hidden"
        >
          <ChevronLeft size={20} />
        </Button>
        <Header />
        <ChannelList handleAside={handleAside} />
        <CreateNewChannel />
      </div>
    </aside>
  );
}
