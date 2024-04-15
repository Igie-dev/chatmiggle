import Header from "./Header";

type Props = {
  asideRef: React.ForwardedRef<HTMLDivElement | null>;
  handleAside: () => void;
};
export default function ChatboxAside({ asideRef, handleAside }: Props) {
  return (
    <aside
      ref={asideRef}
      className="h-full flex flex-col p-1  md:border md:rounded-lg w-full absolute top-0 right-0 xl:static bg-background  xl:translate-x-0 transition-all translate-x-full xl:w-[22rem] 2xl:w-[24rem]"
    >
      <Header handleAside={handleAside} />
    </aside>
  );
}
