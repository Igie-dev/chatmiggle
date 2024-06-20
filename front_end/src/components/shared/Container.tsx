type Props = {
  children: React.ReactNode;
};
function Container({ children }: Props) {
  return (
    <section className="flex items-center justify-center w-screen h-screen bg-background md:p-2">
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden border">
        {children}
      </div>
    </section>
  );
}

export default Container;
