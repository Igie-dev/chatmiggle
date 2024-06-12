import DisplayAvatar from "@/components/shared/DisplayAvatar";

type Props = {
  avatarId: string;
};
export default function ChannelAvatar({ avatarId }: Props) {
  return (
    <div className="w-8 h-8">
      <DisplayAvatar id={avatarId} />
    </div>
  );
}
