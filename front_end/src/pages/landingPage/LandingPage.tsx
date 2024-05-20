import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col w-full h-fit">
      <header className="w-full container_padding h-fit">
        <div className="flex items-end justify-between h-20 pb-4 border-b border-muted md:px-4">
          <span className="mb-2 text-sm font-semibold">ChatMiggle</span>
          <div className="flex items-center gap-2 h-fit">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-col w-full pt-20 md:pt-32 container_padding">
        <div className="flex flex-col items-center w-full lg:items-start">
          <span className="hero_fancy_text">CHATMIGGLE</span>
          <p className="text-sm font-light text-center w-full lg:text-start md:max-w-[50rem] lg:pl-5 lg:text-lg mt-5">
            Welcome to WebChat, the ultimate solution for seamless online
            communication. Our web-based chat application is designed to bring
            people together, offering real-time messaging with lightning-fast
            speed and top-notch security.
          </p>
        </div>
        <div className="relative flex flex-col items-center w-full mt-20 h-fit lg:items-start ">
          <div className="relative flex flex-col items-start w-full py-2 pl-2 space-y-1 md:pl-10 lg:w-1/2">
            <span className="absolute w-[10rem] border-t border-l border-b top-5 -z-10 left-2 h-[40%]" />
            <div className="ml-3 flex w-[60%]  md:max-w-[20rem] h-14 p-1 gap-4 border rounded-md bg-background relative">
              <span className="h-full rounded-full w-11 bg-accent" />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold">John Due</span>
                <span className="text-[10px] text-muted-foreground">
                  Metting today at 3p.m!
                </span>
              </div>
            </div>
            <div className="flex ml-16 w-[60%] p-1 md:max-w-[20rem] h-14 gap-4 border rounded-md bg-background relative">
              <span className="h-full rounded-full w-11 bg-accent" />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold">Ann Mediz</span>
                <span className="text-[10px] text-muted-foreground">
                  Hello!
                </span>
              </div>
            </div>
            <div className="flex ml-32 w-[60%] p-1 md:max-w-[20rem] h-14 gap-4 border rounded-md bg-background relative">
              <span className="h-full rounded-full w-11 bg-accent" />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold">Jose Cruz</span>
                <span className="text-[10px] text-muted-foreground">
                  wasup!
                </span>
              </div>
              <span className="absolute w-1/2 border-t border-r border-b bottom-5 -z-10 -right-5 h-[130%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
