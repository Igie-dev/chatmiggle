import Avatar from "./DisplayAvatar";
type Props = {
  members: TChannelMemberData[];
};
export default function DisplayGroupMemberSeen({ members }: Props) {
  const limit = members.length >= 4 ? members.slice(0, 4) : members;
  return (
    <div className="relative flex h-4 mr-1 min-w-8 max-w-10">
      {limit.map((m: TChannelMemberData, i: number) => {
        return (
          <div
            key={m.user_id}
            className="absolute bottom-0 w-4 h-4 border rounded-full"
            style={{
              left: i === 0 ? `${i}px` : `${i + 8}px`,
            }}
          >
            <Avatar id={m.user_id} />
          </div>
        );
      })}
      {members.length >= 4 ? (
        <span className="absolute bottom-0 right-0 flex text-xs">+</span>
      ) : null}
    </div>
  );
}
