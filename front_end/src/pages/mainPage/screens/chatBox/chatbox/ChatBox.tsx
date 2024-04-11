import ChatInput from "./ChatInput";
import Header from "./Header";
import MessageList from "./MessageList";
type Props = {
  handleAside: () => void;
};

export default function ChatBox({ handleAside }: Props) {
  return (
    <section className="flex flex-col items-center flex-1 h-full p-1 lg:border lg:rounded-lg">
      <Header handleAside={handleAside} />
      <MessageList />
      <ChatInput />
    </section>
  );
}
