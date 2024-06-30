import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { EMessageTypes } from "@/types/enums";
import { Send } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSendMessageMutation } from "@/service/slices/channel/channelApiSlice";
import { encryptText } from "@/utils/helper";
type Props = {
  messageType: EMessageTypes | null;
  setMessageType: Dispatch<SetStateAction<EMessageTypes | null>>;
};
export default function TextInput({ setMessageType, messageType }: Props) {
  const { channelId } = useParams();
  const { userId } = useAppSelector(getCurrentUser);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const [mutate, { isLoading }] = useSendMessageMutation();
  const handleBlur = () => {
    if (messageText.length >= 1) return;
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = "0px";
    }
    setMessageType(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    if (textAreaRef?.current) {
      if (messageText.length >= 1) {
        textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + "px";
      } else {
        textAreaRef.current.style.height = "0px";
      }
    }
  };

  const handleSend = async () => {
    if (!channelId || !messageText) return;
    const data: TSendMessage = {
      channelId: channelId,
      senderId: userId,
      message: encryptText(messageText),
      type: "text",
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await mutate(data);
      if (res?.data) {
        setMessageText("");
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "0px";
          textAreaRef.current.value = "";
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMessageType(null);
    }
  };

  if (messageType === EMessageTypes.TYPE_IMG) return null;
  return (
    <div className="flex items-end flex-1 gap-2 h-fit">
      <textarea
        ref={textAreaRef}
        onBlur={handleBlur}
        disabled={isLoading}
        placeholder="Message"
        value={messageText}
        onChange={handleInputChange}
        onKeyUp={(e) => {
          if (!e.currentTarget.value) {
            setMessageType(null);
          } else {
            setMessageType(EMessageTypes.TYPE_TEXT);
          }
        }}
        style={{
          minHeight: "3.2rem",
          lineHeight: 1.5,
        }}
        className="px-4 pt-[.8rem] max-h-[12rem] whitespace-pre-wrap break-all flex-1 rounded-lg  transition-all bg-transparent border text-sm  resize-none outline-none"
      />
      {messageText.length >= 1 ? (
        <Button
          size="icon"
          variant="default"
          disabled={isLoading}
          onClick={handleSend}
          className={`flex items-center   h-[3rem] w-fit px-5 mb-[2px]   border rounded-lg bg-primary ${
            isLoading ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          <Send size={25} />
        </Button>
      ) : null}
    </div>
  );
}
