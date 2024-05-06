import { Outlet } from "react-router-dom";

export default function AvatarPage() {
  return (
    <section className="flex items-center justify-center w-screen h-screen bg-background">
      <Outlet />
    </section>
  );
}
