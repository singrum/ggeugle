import { Ball } from "@/components/ball";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";

export default function GameState({ id }: { id: string }) {
  const finished = useWcStore((e) => e.gameMap[id].finished);
  const isWin = useWcStore((e) => e.gameMap[id].isWin);
  return (
    <div className="flex items-center gap-3">
      <Ball variant={finished ? (isWin ? "win" : "lose") : "removed"} />

      <span
        className={cn("font-medium", { "text-muted-foreground": !finished })}
      >
        {finished ? (isWin ? "승리" : "패배") : "플레이 중"}
      </span>
    </div>
  );
}
