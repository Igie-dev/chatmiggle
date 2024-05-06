type Props = {
  children: React.ReactNode;
};
function Container({ children }: Props) {
  return (
    <section className="flex items-center justify-center w-screen h-screen lg:px-10 lg:py-2 xl:px-10 bg-background/50">
      <div className="relative flex w-full h-full overflow-hidden lg:rounded-2xl lg:py-2 xl:py-4 xl:gap-2 lg:pr-4 xl:pr-8 bg-background/50">
        {children}
      </div>
    </section>
  );
}

export default Container;
