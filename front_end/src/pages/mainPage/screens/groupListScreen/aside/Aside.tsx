import { ForwardedRef } from "react";
import Header from "../../../shared/Header";
import GroupList from "./GroupList";
type Props = {
  handleAside: () => void;
  asideRef: ForwardedRef<HTMLElement | null>;
};
export default function AsideNav({ handleAside, asideRef }: Props) {
  return (
    <aside
      ref={asideRef}
      className="absolute top-0 left-0 z-50 w-full h-full bg-primary-foreground/60 lg:static lg:translate-x-0  transition-all lg:w-[22rem]"
    >
      <div className="flex flex-col h-full w-[22rem] py-5 px-4 gap-2 bg-background border-r lg:w-full lg:border-none">
        <Header />
        <GroupList handleAside={handleAside} />
      </div>
    </aside>
  );
}
