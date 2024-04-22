import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import { useGetChannelQuery } from "@/service/slices/channel/channelApiSlice";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import GroupMembers from "./GroupMembers";
import LeaveGroup from "./LeaveGroup";
import AddMember from "./AddMember";
type Props = {
  asideRef: React.ForwardedRef<HTMLDivElement | null>;
  handleAside: () => void;
};
export default function ChatboxAside({ asideRef, handleAside }: Props) {
  const { channelId } = useParams();
  const { data, isFetching } = useGetChannelQuery(channelId as string);
  const [isOpenMembers, setIsOpenMembers] = useState(false);
  return (
    <aside
      ref={asideRef}
      className="h-full flex flex-col p-1   md:border md:rounded-lg w-full absolute top-0 right-0 xl:static bg-background  xl:translate-x-0 transition-all translate-x-full xl:w-[22rem] 2xl:w-[24rem]"
    >
      <Header
        handleAside={handleAside}
        channel={data}
        isFetching={isFetching}
      />
      <div className="w-full h-[75%] relative mt-10  overflow-auto">
        {data && !isFetching ? (
          <>
            <div className="flex flex-col w-full h-fit">
              {!data?.is_private ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    to={`/avatar/upload/${data?.channel_id}`}
                    className="flex justify-between w-full px-4"
                  >
                    <p>Change group picture</p>
                    <ChevronRight size={20} />
                  </Link>
                </Button>
              ) : null}
              {!data?.is_private ? (
                <AddMember
                  channelId={data?.channel_id}
                  groupName={data?.group_name}
                />
              ) : null}

              {!data?.is_private ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpenMembers(true)}
                  className="flex justify-between w-full px-4"
                >
                  <p>Members</p>
                  <ChevronRight size={20} />
                </Button>
              ) : null}
              {!data?.is_private ? (
                <LeaveGroup
                  channelId={data?.channel_id}
                  groupName={data?.group_name}
                />
              ) : null}
            </div>
          </>
        ) : null}

        {isOpenMembers ? (
          <GroupMembers
            members={data?.members}
            setIsOpenMembers={setIsOpenMembers}
          />
        ) : null}
      </div>
    </aside>
  );
}
