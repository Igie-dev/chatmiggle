import { Outlet, useParams } from "react-router-dom";
import AsideNav from "./aside/Aside";
import Container from "@/components/shared/Container";
export default function ChannelScreen() {
  const { channelId } = useParams();
  return (
    <Container>
      <>
        <AsideNav />
        <main className="relative w-full h-full lg:flex-1">
          {!channelId ? null : <Outlet />}
        </main>
      </>
    </Container>
  );
}
