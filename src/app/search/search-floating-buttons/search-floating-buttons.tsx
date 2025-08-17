import { Button } from "@/components/ui/button";
import { useIsTablet } from "@/hooks/use-tablet";
import { MoveDown, MoveUp } from "lucide-react";
import MobileCharListTrigger from "../char-list-sidebar/mobile-char-list-trigger";

export default function SearchFloatingButtons() {
  const isTablet = useIsTablet();
  return (
    <div className="fixed right-2 bottom-18 z-50 flex items-end gap-2 lg:right-4 lg:bottom-4">
      {isTablet ? (
        <MobileCharListTrigger />
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant={"secondary"}
            onClick={() => {
              setTimeout(() => {
                document.documentElement.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 0);
            }}
          >
            <MoveUp />
          </Button>
          <Button
            size="icon"
            variant={"secondary"}
            onClick={() => {
              setTimeout(() => {
                document.documentElement.scrollTo({
                  top: document.documentElement!.scrollHeight,
                  behavior: "smooth",
                });
              }, 0);
            }}
          >
            <MoveDown />
          </Button>
        </div>
      )}
    </div>
  );
}
