import { Separator } from "@/components/ui/separator";
import { GameInfo, strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { ChevronRight, Clipboard, ClipboardCheck, X } from "lucide-react";
import React, { useState } from "react";
import { RiRobot2Fill } from "react-icons/ri";

export default function GameList() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);

  return (
    <div
      className={cn(
        "w-full flex flex-col-reverse gap-4 p-0 pb-[200px] pt-10 md:p-5",
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
        "w-full flex flex-col border-border md:border md:rounded-lg px-4 py-3 pr-3 gap-2 bg-muted/40",
        { " md:ring-2 md:ring-ring": gameInfo.isPlaying }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <RiRobot2Fill
            className={cn("h-5 w-5", strengths[gameInfo.strength].color)}
          />

          <div>{strengths[gameInfo.strength].name}</div>
          <div className="">{","}</div>
          <div>{gameInfo.isFirst ? "선공" : "후공"}</div>
          <div className="">{","}</div>
          <div>{gameInfo.steal ? "단어 뺏기 가능" : "단어 뺏기 불가"}</div>
        </div>
        <div className="flex gap-1">
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
              <ClipboardCheck className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Clipboard className="w-5 h-5" strokeWidth={1.5} />
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
            <X className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {gameInfo.moves.length >= 1 && (
        <div className="flex flex-wrap gap-1 items-center text-ellipsis">
          {gameInfo.moves.map((move, i) => (
            <React.Fragment key={i}>
              <div className="text-sm text-foreground">{move}</div>
              {i !== gameInfo.moves.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

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
