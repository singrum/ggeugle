import { GameInfo, strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Clipboard, Dot, X } from "lucide-react";
import React, { useState } from "react";
import { RiRobot2Fill } from "react-icons/ri";

export default function GameList() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);

  return (
    <div
      className={cn(
        "w-full flex flex-col-reverse gap-2 md:gap-4 pt-10 p-4 pb-[200px] md:pb-4",
        {
          "items-center justify-center": games.length === 0 && !currGame,
        }
      )}
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
        "w-full flex flex-col md:rounded-xl px-4 py-3 pr-3 gap-2 border border-border rounded-lg",
        { "ring-2 ring-ring": gameInfo.isPlaying }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium">
          <RiRobot2Fill
            className={cn("h-5 w-5 mr-1", strengths[gameInfo.strength].color)}
          />

          <div>{strengths[gameInfo.strength].name}</div>

          <Dot className="w-4 h-4" />
          <div>{gameInfo.isFirst ? "선공" : "후공"}</div>
          <Dot className="w-4 h-4" />

          <div>{gameInfo.steal ? "단어 뺏기 가능" : "단어 뺏기 불가"}</div>
        </div>

        <div className="flex gap-1">
          <div
            className="p-1 rounded-md hover:bg-accent cursor-pointer w-6 h-6 flex items-center justify-center"
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
              <Check className="w-4 h-4" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </div>
          <div
            className="p-1 rounded-md hover:bg-accent cursor-pointer w-6 h-6 flex items-center justify-center"
            onClick={() => {
              if (gameInfo.isPlaying) {
                setCurrGame(undefined);
              } else {
                setGames(games.filter((_, i) => i !== index));
              }
            }}
          >
            <X className="w-4 h-4" />
          </div>
        </div>
      </div>

      {gameInfo.moves.length >= 1 && (
        <div className="flex flex-wrap gap-x-0.5 gap-y-1 items-center text-ellipsis">
          {gameInfo.moves.map((move, i) => (
            <React.Fragment key={i}>
              <div className="text-sm text-foreground">{move}</div>
              {i !== gameInfo.moves.length - 1 && (
                <ChevronRight
                  className="w-3 h-3 text-muted-foreground"
                  strokeWidth={1}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {gameInfo.isPlaying ? (
        <div className="text-sm font-medium">플레이 중</div>
      ) : gameInfo.winner === "me" ? (
        <div className="text-win text-sm font-medium">승리</div>
      ) : (
        <div className="text-los text-sm font-medium">패배</div>
      )}
    </div>
  );
}
