import { Outlet, useParams } from "react-router-dom";
import AsideNav from "./aside/Aside";
import Container from "../../../../components/shared/Container";
import NoSelectedChannelUi from "@/components/shared/NoSelectedChannelUi";
export default function ChannelScreen() {
  const { channelId } = useParams();
  return (
    <Container>
      <>
        <AsideNav />
        <main className="w-full h-full lg:flex-1">
          {!channelId ? <NoSelectedChannelUi /> : <Outlet />}
        </main>
      </>
    </Container>
  );
}
