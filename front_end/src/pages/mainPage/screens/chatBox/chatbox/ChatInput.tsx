import { useRef, useState } from "react";
import { Image, File, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { asyncEmit } from "@/socket";
export default function ChatInput() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const { channelId } = useParams();
  const { user_id } = useAppSelector(getCurrentUser);
  const handleFocus = () => {
    textAreaRef?.current?.classList.add("h-[10rem]");
    textAreaRef?.current?.classList.remove("h-[3rem]");
    moreRef?.current?.classList.add("hidden");
    moreRef?.current?.classList.remove("visible");
  };

  const handleBlur = () => {
    textAreaRef?.current?.classList.add("h-[3rem]");
    textAreaRef?.current?.classList.remove("h-[10rem]");
    moreRef?.current?.classList.add("visible");
    moreRef?.current?.classList.remove("hidden");
  };

  const handleSubmit = async () => {
    if (!channelId || !messageText) return;

    const data: TSendMessage = {
      channel_id: channelId,
      sender_id: user_id,
      message: messageText,
      type: "text",
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await asyncEmit("send_new_message", data);
      if (res?.data) {
        setTimeout(() => {
          setMessageText("");
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-end w-full gap-2 px-2 py-4 h-fit">
      <div ref={moreRef} className="flex h-[3rem] gap-1 w-fit  items-center">
        <Image size={25} className="opacity-70" />
        <File size={25} className="opacity-70" />
      </div>
      <textarea
        ref={textAreaRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        className="px-2 py-3 h-[3rem] flex-1 transition-all bg-transparent border text-sm  resize-none rounded-lg outline-none"
      />
      <Button
        size="lg"
        variant="default"
        onClick={handleSubmit}
        className="flex items-center h-[3rem] px-5 md:px-8 text-white border rounded-lg bg-primary"
      >
        <SendHorizontal size={25} />
      </Button>
    </div>
  );
}
