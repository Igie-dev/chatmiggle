import { useState, useDeferredValue, ChangeEvent, useRef } from "react";
import ChannelList from "./ChannelList";
import { Input } from "@/components/ui/input";
type Props = {
  handleAside: () => void;
};
export default function ChannelsContainer({ handleAside }: Props) {
  const [search, setSearch] = useState("");
  const defferedSearch = useDeferredValue(search);
  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setSearch(value);
    }, 1000);
  };
  return (
    <div className="flex flex-col h-[89%] w-full gap-2">
      <header className="flex flex-col items-start w-full gap-1 pb-2 border-b h-fit">
        <span className="ml-1 text-sm font-semibold">Chat</span>
        <Input
          type="text"
          placeholder="Search..."
          className="h-12 bg-transparent"
          onChange={(e) => handleChange(e)}
        />
      </header>
      <ChannelList searchText={defferedSearch} handleAside={handleAside} />
    </div>
  );
}
