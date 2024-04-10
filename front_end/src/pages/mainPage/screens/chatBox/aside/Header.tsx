import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type Props = {
  handleAside: () => void;
  channelId: string;
};

function Header({ handleAside, channelId }: Props) {
  return (
    <header className="flex items-center justify-between w-full h-20 px-2">
      <div>{channelId}</div>
      <div>
        <Button
          onClick={handleAside}
          size="icon"
          variant="ghost"
          className="xl:hidden"
        >
          <X size={20} />
        </Button>
      </div>
    </header>
  );
}

export default Header;
