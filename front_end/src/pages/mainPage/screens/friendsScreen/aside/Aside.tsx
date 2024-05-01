import { useRef } from "react";
import Header from "../../../../../components/shared/Header";
import FriendsList from "./FriendsList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NewChannelButtons from "@/components/shared/NewChannelButtons";
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
      className="absolute top-0 left-0 z-50 w-full h-full bg-background/90 lg:static lg:translate-x-0  transition-all lg:w-[22rem]"
    >
      {/* Close nav button */}
      <Button
        onClick={handleAside}
        size="icon"
        variant="ghost"
        className="absolute z-50 -right-12 top-2 lg:hidden"
      >
        <ChevronRight size={20} />
      </Button>
      <div className="flex flex-col h-full w-[22rem] py-5 px-2 gap-2 bg-background/90 border-r lg:w-full lg:border-none relative">
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
        <FriendsList handleAside={handleAside} />
        <NewChannelButtons />
      </div>
    </aside>
  );
}
