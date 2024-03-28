import { Input } from "@/components/ui/input";
type Props = {
  handleAside: () => void;
};
export default function ChannelList({ handleAside }: Props) {
  return (
    <div onClick={handleAside} className="flex flex-col h-[87%] w-full gap-2 ">
      <header className="flex flex-col items-start w-full gap-1 rounded-sm h-fit">
        <h1 className="text-sm font-semibold">Chat</h1>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-primary-foreground h-11"
        />
      </header>
      <ul className="flex flex-col w-full h-[92%] overflow-y-auto py-2 px-0"></ul>
    </div>
  );
}
