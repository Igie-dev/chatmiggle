type Props = {
  children: React.ReactNode;
};
function Container({ children }: Props) {
  return (
    <section className="w-screen h-screen p-2  md:p-5 bg-background/50">
      <div className="relative flex w-full h-full overflow-hidden border rounded-2xl bg-background/50">
        {children}
      </div>
    </section>
  );
}

export default Container;
