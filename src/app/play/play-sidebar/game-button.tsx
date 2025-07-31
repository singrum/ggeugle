import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useWcStore } from "@/stores/wc-store";
import { Check, Clipboard, Trash2 } from "lucide-react";
import { useState } from "react";
import GameMoves from "./game-moves";
import GameState from "./game-state";
import GameTitle from "./game-title";

export default function GameButton({ id }: { id: string }) {
  const selectGame = useWcStore((e) => e.selectGame);
  const selectedGame = useWcStore((e) => e.selectedGame);
  const deleteGame = useWcStore((e) => e.deleteGame);
  const setOpen = useWcStore((e) => e.setPlayDrawerOpen);
  const copyMoves = useWcStore((e) => e.copyMoves);
  const [clipComplete, setClipComplete] = useState(false);
  return (
    <Card
      className={cn(
        "dark:bg-muted/50 relative w-full gap-0 border bg-transparent p-0 transition-shadow hover:shadow-md dark:border-0",
        {
          "ring-primary ring-2": selectedGame === id,
        },
      )}
    >
      <Button
        onClick={() => {
          selectGame(id);
          setOpen(false);
        }}
        variant="ghost"
        className={cn(
          "flex h-auto w-full flex-col items-start gap-4 rounded-xl rounded-b-none p-4 text-left font-normal whitespace-normal",
        )}
      >
        <GameTitle id={id} />
        <GameMoves id={id} />
        <GameState id={id} />
      </Button>

      <Separator />

      <CardFooter className="flex h-12 justify-center px-0">
        <Button
          variant="ghost"
          className="h-full flex-1 rounded-none rounded-bl-xl"
          onClick={() => {
            copyMoves(id);

            setClipComplete(true);
            setTimeout(() => {
              setClipComplete(false);
            }, 2000);
          }}
        >
          {clipComplete ? (
            <Check className="stroke-foreground" />
          ) : (
            <Clipboard className="stroke-foreground" />
          )}
          복사
        </Button>
        <Separator orientation="vertical" className="!h-6" />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            deleteGame(id);
          }}
          variant="ghost"
          className="text-destructive hover:text-destructive h-full flex-1 rounded-none rounded-br-xl"
        >
          <Trash2 className="stroke-destructive" />
          삭제
        </Button>
      </CardFooter>
    </Card>
  );
}
