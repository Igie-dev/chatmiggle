import { useEffect, useState } from "react";
import DisplayAvatar from "@/components/shared/DisplayAvatar";
type Props = {
  members: TChannelMemberData[];
  senderId: string;
};
export default function DisplayGroupMemberSeen({ members, senderId }: Props) {
  const [seenMembers, setSeenMembers] = useState<TChannelMemberData[]>([]);

  useEffect(() => {
    const removeSender = members.filter((m) => m.userId !== senderId);
    if (removeSender.length >= 0) {
      const limit =
        removeSender.length >= 4 ? removeSender.slice(0, 4) : removeSender;
      setSeenMembers(limit);
    }
  }, [members, senderId]);

  return (
    <div className="relative flex h-4 mr-1 min-w-8 max-w-12">
      {seenMembers.map((m: TChannelMemberData, i: number) => {
        if (m.userId === senderId) return null;
        return (
          <div
            key={m.userId}
            className="absolute bottom-0 w-4 h-4 border rounded-full"
            style={{
              left:
                i === 0
                  ? `${i}px`
                  : i === 1
                  ? `${i + 5}px`
                  : i === 2
                  ? `${i + 10}px`
                  : `${i + 15}px`,
            }}
          >
            <DisplayAvatar id={m.user?.avatarId as string} />
          </div>
        );
      })}
      {members.length >= 4 ? (
        <span className="absolute bottom-0 right-0 flex text-xs">+</span>
      ) : null}
    </div>
  );
}
