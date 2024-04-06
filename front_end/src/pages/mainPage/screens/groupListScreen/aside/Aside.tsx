import { ForwardedRef } from "react";
import Header from "../../../../../components/shared/Header";
import GroupList from "./GroupList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
type Props = {
  handleAside: () => void;
  asideRef: ForwardedRef<HTMLElement | null>;
};
export default function AsideNav({ handleAside, asideRef }: Props) {
  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full bg-background/90 lg:static lg:translate-x-0  transition-all lg:w-[20rem]"
    >
      {/* Close nav button */}
      <Button
        onClick={handleAside}
        size="icon"
        variant="outline"
        className="absolute top-1 -right-11 lg:hidden"
      >
        <ChevronRight size={20} />
      </Button>
      <div className="flex flex-col h-full w-[22rem] py-5 px-4 gap-2 bg-background/50 border-r lg:w-full lg:border-none relative">
        {/* Open nav button */}
        <Button
          onClick={handleAside}
          size="icon"
          variant="outline"
          className="absolute top-1 -right-12 lg:hidden"
        >
          <ChevronLeft size={20} />
        </Button>
        <Header />
        <GroupList handleAside={handleAside} />
        <Button
          variant="secondary"
          title="New Channel"
          className="absolute w-12 h-12 p-2 transition-all border rounded-full bg-secondary/50 hover:bg-secondary bottom-4 right-2 hover:scale-105"
        >
          <Plus size={20} />
        </Button>
      </div>
    </aside>
  );
}
