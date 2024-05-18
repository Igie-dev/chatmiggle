import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
export default function ChatBox() {
  return (
    <section className="relative flex flex-col items-center flex-1 h-full p-1 bg-background">
      <MessageList />
      <ChatInput />
    </section>
  );
}
