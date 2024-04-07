import { Outlet } from "react-router-dom";
import AsideNav from "./aside/Aside";
import { useRef } from "react";
import Container from "../../../../components/shared/Container";
export default function ChannelScreen() {
  const asideRef = useRef<HTMLElement | null>(null);
  const handleAside = () => {
    if (asideRef?.current?.classList.contains("-translate-x-full")) {
      asideRef?.current?.classList.remove("-translate-x-full");
    } else {
      asideRef?.current?.classList.add("-translate-x-full");
    }
  };

  return (
    <Container>
      <>
        <AsideNav asideRef={asideRef} handleAside={handleAside} />
        <main className="w-full h-full lg:flex-1">
          <Outlet />
        </main>
      </>
    </Container>
  );
}