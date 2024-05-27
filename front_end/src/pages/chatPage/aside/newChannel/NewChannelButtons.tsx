import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateNewGroup from "./CreateNewGroup";
import CreateNewChannel from "./CreateNewChannel";
import { Plus } from "lucide-react";

export default function NewChannelButtons() {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="absolute flex flex-col items-end gap-2 pr-5 w-fit h-fit bottom-4 right-2">
      <>
        <CreateNewChannel>
          <Button
            variant="secondary"
            size="icon"
            title="New chat"
            onClick={() => setIsShow(false)}
            className={`w-full p-2 transition-all translate-y-10  border rounded-md opacity-0 h-fit group bg-secondary/50 ${
              isShow
                ? "-translate-y-5  opacity-50 hover:opacity-100 hover:bg-secondary hover:scale-105  delay-100 "
                : "translate-y-10 pointer-events-none  delay-200 "
            }`}
          >
            <p className="text-xs font-light ">New Chat</p>
          </Button>
        </CreateNewChannel>
        <CreateNewGroup>
          <Button
            variant="secondary"
            title="New chat"
            size="icon"
            onClick={() => setIsShow(false)}
            className={`w-full p-2 transition-all translate-y-10  border rounded-md opacity-0 h-fit group bg-secondary/50 ${
              isShow
                ? "-translate-y-5 opacity-50 hover:opacity-100 hover:bg-secondary hover:scale-105 delay-200 "
                : "translate-y-10 pointer-events-none  delay-100"
            }`}
          >
            <p className="text-xs font-light ">New Group</p>
          </Button>
        </CreateNewGroup>
      </>

      <Button
        variant="secondary"
        title="New chat"
        onClick={() => setIsShow((prev) => !prev)}
        className={`w-10 h-10 p-2 transition-all border rounded-full  bg-secondary/50 hover:opacity-100 hover:bg-secondary hover:scale-105 ${
          isShow ? "opacity-100" : "opacity-50"
        }`}
      >
        <Plus
          size={20}
          className={`transition-all ${isShow ? "rotate-45" : "rotate-0"}`}
        />
      </Button>
    </div>
  );
}
