/* eslint-disable no-empty */
import { useState } from "react";
import { EMessageTypes } from "@/types/enums";
import TextInput from "./TextInput";
import ImageInput from "./ImageInput";
export default function ChatInput() {
  const [messageType, setMessageType] = useState<EMessageTypes | null>(null);
  return (
    <div className="flex items-end justify-end w-full gap-2 px-2 pt-4 pb-2 h-fit md:px-4">
      <TextInput setMessageType={setMessageType} messageType={messageType} />
      <ImageInput setMessageType={setMessageType} messageType={messageType} />
    </div>
  );
}
