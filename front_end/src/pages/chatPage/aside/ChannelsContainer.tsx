import { useState, useDeferredValue, ChangeEvent } from "react";
import ChannelList from "./ChannelList";
import { Input } from "@/components/ui/input";
type Props = {
  handleAside: () => void;
};
export default function ChannelsContainer({ handleAside }: Props) {
  const [search, setSearch] = useState("");
  const defferedSearch = useDeferredValue(search);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTimeout(() => {
      setSearch(value);
    }, 500);
  };
  return (
    <div className="flex flex-col h-[89%] w-full gap-2">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-lg font-semibold">Chat</h1>
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => handleChange(e)}
        />
      </header>
      <ChannelList searchText={defferedSearch} handleAside={handleAside} />
    </div>
  );
}
