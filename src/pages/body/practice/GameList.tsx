import { GameInfo, strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { Bot, ChevronRight, Clipboard, ClipboardCheck, X } from "lucide-react";
import React, { useState } from "react";

export default function GameList() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);
  return (
    <div
      className={cn("w-full flex flex-col-reverse gap-2 p-3 md:p-5", {
        "items-center justify-center": games.length === 0 && !currGame,
      })}
    >
      {games.length === 0 && !currGame && (
        <div className="text-muted-foreground">플레이한 게임이 없습니다.</div>
      )}

      {games.map((e, i) => (
        <GameButton key={i} gameInfo={e} index={i} />
      ))}
      {currGame && currGame.isPlaying && <GameButton gameInfo={currGame} />}
    </div>
  );
}

function GameButton({
  gameInfo,
  index,
}: {
  gameInfo: GameInfo;
  index?: number;
}) {
  const [clipComplete, setClipComplete] = useState(false);
  const [games, setGames, setCurrGame] = useWC((e) => [
    e.games,
    e.setGames,
    e.setCurrGame,
  ]);
  return (
    <div
      className={cn(
        "w-full flex flex-col border-border border rounded-lg p-3 gap-1",
        { "ring-2 ring-ring": gameInfo.isPlaying }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Bot className={cn("h-5 w-5", strengths[gameInfo.strength].color)} />
          <div>{strengths[gameInfo.strength].name}</div>
          <div className="">{","}</div>
          <div>{gameInfo.isFirst ? "선공" : "후공"}</div>
        </div>
        <div className="flex gap">
          <div
            className="p-1 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => {
              if (gameInfo.moves.length > 0) {
                navigator.clipboard.writeText(gameInfo.moves.join(" "));

                setClipComplete(true);
                setTimeout(() => {
                  setClipComplete(false);
                }, 2000);
              }
            }}
          >
            {clipComplete ? (
              <ClipboardCheck className="w-5 h-5" />
            ) : (
              <Clipboard className="w-5 h-5" />
            )}
          </div>
          <div
            className="p-1 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => {
              if (gameInfo.isPlaying) {
                setCurrGame(undefined);
              } else {
                setGames(games.filter((_, i) => i !== index));
              }
            }}
          >
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 items-center text-ellipsis">
        {gameInfo.moves.map((move, i) => (
          <React.Fragment key={i}>
            <div className="text-xs text-foreground">{move}</div>
            {i !== gameInfo.moves.length - 1 && (
              <div className="text-muted-foreground">
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {gameInfo.isPlaying ? (
        <div className="">플레이 중</div>
      ) : gameInfo.winner === "me" ? (
        <div className="text-win">승리</div>
      ) : (
        <div className="text-los">패배</div>
      )}
    </div>
  );
}
