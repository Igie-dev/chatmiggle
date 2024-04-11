import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type Props = {
  handleAside: () => void;
};

function Header({ handleAside }: Props) {
  return (
    <header className="flex items-center justify-between w-full h-20 px-2">
      <div>Header</div>
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
