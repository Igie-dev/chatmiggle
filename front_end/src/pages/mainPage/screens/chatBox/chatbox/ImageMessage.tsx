import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
type Props = {
  message: TMessageData;
};

export default function ImageMessage({ message }: Props) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (imageRef.current) {
            setIntersecting(true);
          }
        } else {
          setIntersecting(false);
        }
      },
      {
        root: null,
        threshold: 0.5, // set offset 0.1 means trigger if atleast 10% of element in viewport
      }
    );

    const interval = setInterval(() => {
      if (imageRef?.current) {
        observer.observe(imageRef?.current);
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isIntersecting]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={imageRef}
          className="flex items-center justify-center w-[12rem] h-[16rem]"
        >
          {isIntersecting ? (
            <Avatar className="flex items-center justify-center w-full h-full rounded-sm">
              <AvatarImage
                src={message.message}
                className="object-contain w-full h-full cursor-pointer"
              />
              <AvatarFallback className="w-full h-full">
                <Skeleton className="w-full h-full" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        ref={imageRef}
        className="sm:max-w-[50rem] p-2 flex items-center justify-center min-h-[90vh]"
      >
        {isIntersecting ? (
          <Avatar className="flex items-center justify-center w-full h-full rounded-sm">
            <AvatarImage
              src={message.message}
              className="object-contain w-full h-full cursor-pointer"
            />
            <AvatarFallback className="w-full h-full">
              <Skeleton className="w-full h-full" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </DialogContent>
    </Dialog>
  );
}
