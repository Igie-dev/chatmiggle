import Header from "./Header";
type Props = {
  handleAside: () => void;
  channelId: string;
};

export default function ChatBox({ handleAside, channelId }: Props) {
  return (
    <section className="flex flex-col flex-1 h-full p-1 lg:border lg:rounded-lg">
      <Header handleAside={handleAside} />
      <div className="w-full h-[80%] ">{channelId}</div>
      <div className="w-full h-[10%] ">Input</div>
    </section>
  );
}
