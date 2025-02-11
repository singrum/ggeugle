import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GameInfo, strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Clipboard,
  Dot,
  MessageCircleX,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { RiRobot2Fill } from "react-icons/ri";

export default function GameList() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);

  return (
    <div
      className={cn(
        "w-full flex flex-col-reverse gap-4 p-4 pt-[100px] md:pt-4 pb-[200px] md:pb-4",
        {
          "h-full items-center justify-center": games.length === 0 && !currGame,
        }
      )}
    >
      {games.length === 0 && !currGame && (
        <div className="flex items-center flex-col gap-2">
          <MessageCircleX
            className="h-12 w-12 text-muted-foreground"
            strokeWidth={1.2}
          />
          <div className="text-muted-foreground">플레이한 게임이 없습니다.</div>
        </div>
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
        "w-full flex flex-col md:rounded-xl px-4 py-3 pr-3 gap-4 border border-border rounded-lg",
        { "ring-2 ring-ring": gameInfo.isPlaying }
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 overflow-auto scrollbar-none whitespace-nowrap">
          <div className="flex items-center text-sm font-medium">
            <div>
              <RiRobot2Fill
                className={cn(
                  "h-5 w-5 mr-1",
                  strengths[gameInfo.strength].color
                )}
              />
            </div>

            <div>{strengths[gameInfo.strength].name}</div>
            <span className="text-muted-foreground">
              {gameInfo.strength === 2 && (
                <>
                  <div>({gameInfo.calcTime}초)</div>
                </>
              )}
            </span>
            <div>
              <Dot className="w-4 h-4" />
            </div>
            <div>{gameInfo.isFirst ? "선공" : "후공"}</div>
            <div>
              <Dot className="w-4 h-4" />
            </div>
            <div>{gameInfo.steal ? "단어 뺏기 가능" : "단어 뺏기 불가"}</div>
          </div>
        </div>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={"ghost"}
                  className="w-6 h-6"
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
                </Button>
              </TooltipTrigger>
              <TooltipContent>복사</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={"ghost"}
                  className="w-6 h-6"
                  onClick={() => {
                    if (gameInfo.isPlaying) {
                      setCurrGame(undefined);
                    } else {
                      setGames(games.filter((_, i) => i !== index));
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>삭제</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {gameInfo.moves.length >= 1 && (
        <div className="flex flex-wrap gap-x-0.5 gap-y-1 items-center text-ellipsis">
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
        <div className="text-sm font-medium">플레이 중</div>
      ) : gameInfo.winner === "me" ? (
        <div className="text-win text-sm font-medium">승리</div>
      ) : (
        <div className="text-los text-sm font-medium">패배</div>
      )}
    </div>
  );
}
