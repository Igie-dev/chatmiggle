import MemberCard from "./MemberCard";
import AddMember from "./AddMember";
import LeaveGroup from "./LeaveGroup";
type Props = {
  members: TChannelMemberData[];
  channelId: string;
  groupName: string;
};
export default function GroupMembers({ members, channelId, groupName }: Props) {
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full gap-2 p-2 bg-background">
      <div className="flex items-center justify-between pt-2 pb-4 border-b">
        <AddMember channelId={channelId} groupName={groupName} />
        <LeaveGroup channelId={channelId} groupName={groupName} />
      </div>
      <div className="w-full h-[95%] overflow-auto">
        <ul className="flex flex-col w-full pb-5 h-fit">
          {members?.length >= 1
            ? members.map((member) => {
                return (
                  <MemberCard
                    key={member.user_id}
                    channelId={channelId}
                    groupName={groupName}
                    userId={member.user_id}
                  />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}
