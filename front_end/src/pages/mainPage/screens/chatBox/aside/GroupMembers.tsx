import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import MemberCard from "./MemberCard";
type Props = {
  members: TChannelMemberData[];
  setIsOpenMembers: Dispatch<SetStateAction<boolean>>;
};
export default function GroupMembers({ members, setIsOpenMembers }: Props) {
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full gap-2 bg-background">
      <div className="flex items-center">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpenMembers(false)}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>
      <div className="w-full h-[95%] overflow-auto">
        <ul className="flex flex-col w-full px-4 py-5 h-fit">
          {members?.length >= 1
            ? members.map((member) => {
                return (
                  <MemberCard key={member.user_id} userId={member.user_id} />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}
