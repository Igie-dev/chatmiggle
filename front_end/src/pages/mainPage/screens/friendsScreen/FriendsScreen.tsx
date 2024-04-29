import { Outlet } from "react-router-dom";
import AsideNav from "./aside/Aside";
import Container from "../../../../components/shared/Container";
export default function FriendsScreen() {
  return (
    <Container>
      <>
        <AsideNav />
        <main className="w-full h-full lg:flex-1 ">
          <Outlet />
        </main>
      </>
    </Container>
  );
}
