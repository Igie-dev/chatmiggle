import Header from "./Header";
type Props = {
  handleAside: () => void;
};

export default function ChatBox({ handleAside }: Props) {
  return (
    <section className="flex flex-col flex-1 h-full p-1 ">
      <Header handleAside={handleAside} />
    </section>
  );
}
