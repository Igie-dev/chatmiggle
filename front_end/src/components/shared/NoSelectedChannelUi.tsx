import CreateNewChannel from "@/pages/mainPage/screens/channelScreen/newChannel/CreateNewChannel";
import { Button } from "../ui/button";
import CreateNewGroup from "@/pages/mainPage/screens/groupScreen/newGroup/CreateNewGroup";
export default function NoSelectedChannelUi() {
  return (
    <div className="flex items-center justify-start w-full h-full px-2 pt-[20%] lg:pt-[15%] flex-col gap-2 ">
      {/* <Hand size={50} className="opacity-70" /> */}
      <h1 className="mt-2 text-lg font-semibold opacity-70">
        No Chat Selected
      </h1>
      <p className="text-xs opacity-70">
        Please select a chat or create a private message with your friend, or
        initiate a group chat with them.
      </p>
      <div className="flex flex-col items-center mt-5">
        <CreateNewChannel>
          <Button size="sm">Send private message</Button>
        </CreateNewChannel>
        <p className="my-1 text-sm opacity-50">Or</p>
        <CreateNewGroup>
          <Button size="sm" variant="outline" className="w-full">
            Create group chat
          </Button>
        </CreateNewGroup>
      </div>
    </div>
  );
}
