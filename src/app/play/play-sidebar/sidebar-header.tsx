import { Button } from "@/components/ui/button";
import { useWcStore } from "@/stores/wc-store";
import { Plus } from "lucide-react";

export default function SidebarHeader() {
  const selectGame = useWcStore((e) => e.selectGame);
  const selectedGame = useWcStore((e) => e.selectedGame);
  const setOpen = useWcStore((e) => e.setPlayDrawerOpen);
  return (
    <div className="bg-background sticky top-0 z-10 w-full rounded-tl-2xl p-4">
      <Button
        className="h-12 w-full rounded-full"
        size="lg"
        variant="secondary"
        disabled={selectedGame === null}
        onClick={() => {
          selectGame(null);
          setOpen(false);
        }}
      >
        <Plus className="size-5" />새 게임
      </Button>
    </div>
  );
}
