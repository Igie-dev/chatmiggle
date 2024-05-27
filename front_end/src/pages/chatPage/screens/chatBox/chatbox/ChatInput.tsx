/* eslint-disable no-empty */
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useSendImageMutation } from "@/service/slices/image/imageApiSLice";
import { asyncEmit } from "@/socket";
export default function ChatInput() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [messageText, setMessageText] = useState("");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imageData, setImageData] = useState<File | null>(null);
  const { channelId } = useParams();
  const { user_id } = useAppSelector(getCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [sendImage, { isLoading: isLoadingSendImage }] = useSendImageMutation();

  const handleFocus = () => {
    if (preview || imageData) return;
    if (moreRef?.current) {
      moreRef.current.style.display = "none";
    }
  };

  const handleBlur = () => {
    if (messageText.length >= 1) return;
    if (textAreaRef?.current) {
      textAreaRef.current.style.height = "0px";
    }
    if (moreRef?.current) {
      moreRef.current.style.display = "flex";
    }
  };

  const handleInputImage = (e: ChangeEvent<HTMLInputElement>) => {
    handleFocus();
    const files = e?.target?.files as FileList;
    setImageData(files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    if (files[0]) {
      reader.readAsDataURL(files[0]);
      if (textAreaRef?.current) {
        textAreaRef.current.style.display = "none";
      }
    }
  };

  const handleRemoveImage = () => {
    if (imageInput.current) {
      imageInput.current.value = "";
      if (textAreaRef?.current) {
        textAreaRef.current.style.display = "flex";
      }
      if (moreRef?.current) {
        moreRef.current.style.display = "flex";
      }
      setImageData(null);
      setPreview(null);
    }
  };

  const handleSubmitTextMessage = async () => {
    if (!messageText && imageData) {
      handleSubmitImageMessage();
      return;
    }
    if (!channelId || !messageText) return;
    setIsLoading(true);
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
        setMessageText("");
        if (!messageText) {
          handleBlur();
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitImageMessage = async () => {
    setIsLoading(true);
    if (!channelId || !imageData) return;
    try {
      const formData = new FormData();
      formData.append("sendimage", imageData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendRes: any = await sendImage(formData);
      if (sendRes?.data?.url) {
        const data = {
          channel_id: channelId,
          sender_id: user_id,
          message: sendRes?.data?.url,
          type: "image",
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await asyncEmit("send_new_message", data);
        if (res?.data) {
          setTimeout(() => {
            handleRemoveImage();
          }, 500);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (preview || imageData) return;
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

  useEffect(() => {
    if (messageText.length <= 0) {
      if (textAreaRef?.current) {
        textAreaRef.current.style.height = "0px";
      }
      if (moreRef?.current) {
        moreRef.current.style.display = "flex";
      }
    } else {
      if (moreRef?.current) {
        moreRef.current.style.display = "none";
      }
    }
  }, [messageText, textAreaRef]);
  return (
    <div className="flex items-end w-full gap-2 px-2 pt-2 h-fit">
      <div className="relative flex items-center flex-1 gap-2 ">
        <textarea
          ref={textAreaRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isLoading}
          placeholder="Message"
          value={messageText}
          onChange={handleInputChange}
          style={{
            minHeight: "3.2rem",
            lineHeight: 1.5,
          }}
          className="px-2 pt-3 border max-h-[12rem] whitespace-pre-wrap break-all flex-1 transition-all bg-transparent  text-sm  resize-none rounded-lg outline-none"
        />
        {preview ? (
          <div className="absolute left-1 bottom-1 bg-background w-[12rem] h-[14.5rem]">
            <Button
              size="icon"
              variant="outline"
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 p-1 rounded-full -right-9 w-fit h-fit"
            >
              <X size={20} />
            </Button>
            <img
              src={preview as string}
              className="object-cover w-full h-full border rounded-lg border-border"
            />
          </div>
        ) : null}
        <div
          ref={moreRef}
          className="absolute flex items-center h-full gap-1 right-1 w-fit"
        >
          <input
            ref={imageInput}
            onChange={handleInputImage}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden text-white"
          />
          <Button
            size="lg"
            variant="ghost"
            onClick={() => imageInput?.current?.click()}
            type="button"
            className="!w-fit px-2"
          >
            <Image className="w-full h-8 opacity-70" />
          </Button>
        </div>
      </div>
      <Button
        size="icon"
        variant="default"
        disabled={isLoading || isLoadingSendImage}
        onClick={handleSubmitTextMessage}
        className={`flex items-center h-[3rem] w-fit px-5 mb-[2px]  border rounded-lg bg-primary ${
          isLoading || isLoadingSendImage ? "cursor-wait" : "cursor-pointer"
        }`}
      >
        <Send size={25} />
      </Button>
    </div>
  );
}
