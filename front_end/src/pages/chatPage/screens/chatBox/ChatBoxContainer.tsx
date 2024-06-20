import ChatboxAside from "./aside/ChatboxAside";
import ChatBox from "./chatbox/ChatBox";
export default function ChatBoxContainer() {
  return (
    <section className="relative flex items-center w-full h-full gap-2">
      <div className="relative flex items-center w-full h-full overflow-hidden">
        <ChatBox />
        <ChatboxAside />
      </div>
    </section>
  );
}
