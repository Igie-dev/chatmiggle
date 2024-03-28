import { Outlet } from "react-router-dom";
import AsideNav from "./aside/Aside";
import { useRef } from "react";

export default function UserListPage() {
  const asideRef = useRef<HTMLElement | null>(null);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("-translate-x-full")) {
      asideRef?.current?.classList.remove("-translate-x-full");
    } else {
      asideRef?.current?.classList.add("-translate-x-full");
    }
  };
  return (
    <section className="relative flex w-screen h-screen">
      <AsideNav handleAside={handleAside} asideRef={asideRef} />
      <main className="w-full h-full border lg:flex-1 bg-primary-foreground">
        <Outlet />
      </main>
    </section>
  );
}
