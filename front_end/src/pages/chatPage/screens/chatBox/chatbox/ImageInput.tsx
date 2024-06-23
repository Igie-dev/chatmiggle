import { Button } from "@/components/ui/button";
import { useSendImageMutation } from "@/service/slices/image/imageApiSLice";
import { getCurrentUser } from "@/service/slices/user/userSlice";
import { useAppSelector } from "@/service/store";
import { EMessageTypes } from "@/types/enums";
import { Send, X, Image } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";

type Props = {
  messageType: EMessageTypes | null;
  setMessageType: Dispatch<SetStateAction<EMessageTypes | null>>;
};
export default function ImageInput({ setMessageType, messageType }: Props) {
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [imageData, setImageData] = useState<File | null>(null);
  const { channelId } = useParams();
  const { user_id } = useAppSelector(getCurrentUser);
  const [sendImage, { isLoading: isLoadingSendImage }] = useSendImageMutation();

  const handleInputImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files as FileList;
    setImageData(files[0]);
  };

  useEffect(() => {
    if (imageData?.name) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      if (imageData) {
        setMessageType(EMessageTypes.TYPE_IMG);
        reader.readAsDataURL(imageData);
      }
    }
  }, [imageData, setPreview, setMessageType]);

  const handleRemoveImage = () => {
    setImageData(null);
    setPreview(null);
    setMessageType(null);
  };

  const handleSubmitImageMessage = async () => {
    if (!channelId || !imageData) return;
    try {
      const formData = new FormData();

      formData.append("channel_id", channelId);
      formData.append("sender_id", user_id);
      formData.append("sendimage", imageData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendRes: any = await sendImage(formData);

      if (sendRes?.data) {
        setTimeout(() => {
          handleRemoveImage();
        }, 500);
      }
    } catch (error) {
      /* empty */
    }
  };
  if (messageType === EMessageTypes.TYPE_TEXT) return null;

  if (!imageData?.name)
    return (
      <div className="flex items-center h-full bg-transparent w-fit">
        <div className="flex items-center h-12 px-1 w-fit">
          <div className="flex items-center h-full ">
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
      </div>
    );
  return (
    <div className="bg-background w-fit h-[16rem] relative mr-2">
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={handleRemoveImage}
        className="absolute p-1 rounded-full top-1 right-1 bg-secondary/50 w-fit h-fit"
      >
        <X size={20} />
      </Button>
      <img
        src={preview as string}
        className="object-cover w-full h-full border rounded-lg border-border"
      />
      <Button
        size="icon"
        variant="default"
        disabled={isLoadingSendImage}
        onClick={handleSubmitImageMessage}
        className={`flex items-center h-[3rem] w-fit px-5 mb-[2px] absolute bottom-1 right-1  border rounded-lg bg-primary ${
          isLoadingSendImage ? "cursor-wait" : "cursor-pointer"
        }`}
      >
        <Send size={25} />
      </Button>
    </div>
  );
}
