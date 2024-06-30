import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetChannelRequestJoinQuery } from "@/service/slices/channel/channelApiSlice";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import RequestJoinCard from "./RequestJoinCard";
export default function RequestJoinList() {
  const [members, setMembers] = useState<TChannelMemberData[] | null>(null);
  const { channelId } = useParams();
  const { data, isFetching } = useGetChannelRequestJoinQuery(
    channelId as string
  );
  useEffect(() => {
    if (data?.length >= 1) {
      setMembers(data);
    } else {
      setMembers([]);
    }
  }, [data]);

  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full gap-2 p-2 pt-5">
      <div className="w-full h-[95%] overflow-y-auto ">
        <ul className="relative flex flex-col items-center w-full gap-1 pb-5 min-h-20 h-fit">
          {isFetching ? <LoaderSpinner /> : null}
          {!isFetching && members && members?.length >= 1
            ? members.map((member) => {
                return (
                  <RequestJoinCard
                    key={member.id}
                    user={member?.user as TUserData}
                  />
                );
              })
            : null}

          {!isFetching && members && members?.length <= 0 ? (
            <p className="text-sm">Empty</p>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
