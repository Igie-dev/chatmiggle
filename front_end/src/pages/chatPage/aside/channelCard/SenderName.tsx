import DisplayUserName from "@/components/shared/DisplayUserName";

type Props = {
  isPrivate: boolean;
  groupName?: string;
  senderId?: string;
};
export default function SenderName({ isPrivate, groupName, senderId }: Props) {
  if (!senderId && isPrivate)
    return (
      <p className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
        User
      </p>
    );
  return isPrivate ? (
    <span className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
      <DisplayUserName userId={senderId ?? ""} />
    </span>
  ) : (
    <p className="w-full max-w-full text-sm truncate opacity-90 max-h-6">
      {groupName}
    </p>
  );
}
