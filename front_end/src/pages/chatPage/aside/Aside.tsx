import { useRef } from "react";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewChannelButtons from "./newChannel/NewChannelButtons";
import ChannelsContainer from "./ChannelsContainer";
export default function AsideNav() {
  const asideRef = useRef<HTMLElement | null>(null);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("-translate-x-full")) {
      asideRef?.current?.classList.remove("-translate-x-full");
    } else {
      asideRef?.current?.classList.add("-translate-x-full");
    }
  };

  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full  transition-all bg-secondary/50 lg:static lg:translate-x-0 lg:w-[22rem] 2xl:w-[25rem]"
    >
      {/* Close nav button */}
      <Button
        onClick={handleAside}
        size="icon"
        variant="outline"
        className="absolute z-50 -right-12 top-2 bg-accent/70 lg:hidden"
      >
        <ChevronRight size={20} />
      </Button>
      <div className="flex flex-col h-full w-[22rem] gap-2 py-2 px-1  border-r bg-secondary lg:w-full relative lg:bg-transparent">
        {/* Open nav button */}
        <Button
          onClick={handleAside}
          size="icon"
          variant="outline"
          className="absolute z-50 -right-12 top-2 bg-accent/70 lg:hidden"
        >
          <ChevronLeft size={20} />
        </Button>
        <Header />
        <ChannelsContainer handleAside={handleAside} />
        <NewChannelButtons />
      </div>
    </aside>
  );
}
