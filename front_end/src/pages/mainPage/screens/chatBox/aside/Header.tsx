import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type Props = {
  handleAside: () => void;
};

function Header({ handleAside }: Props) {
  return (
    <header className="flex items-center justify-between w-full h-20 px-2 border-b lg:w-[98%]">
      <div className="flex items-center flex-1 gap-2 ml-10 lg:ml-0">Header</div>
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
