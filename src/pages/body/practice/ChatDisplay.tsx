import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Chat, strengths, useWC } from "@/lib/store/useWC";
import { cn, getChatIdxByMoveIdx } from "@/lib/utils";
import { josa } from "es-hangul";
import { Bolt, X } from "lucide-react";
import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
export default function ChatDisplay({
  isMy,
  chats,
}: {
  isMy: boolean;
  chats: Chat[];
}) {
  const [currGame, setCurrGame, killWorker, startWorker, games, setGames] =
    useWC((e) => [
      e.currGame,
      e.setCurrGame,
      e.killWorker,
      e.startWorker,
      e.games,
      e.setGames,
    ]);
  return !isMy ? (
    <div className="flex w-full gap-2">
      <div
        className={cn(
          `rounded-full w-10 h-10 flex items-center justify-center bg-accent `,
          strengths[currGame!.strength].color
        )}
      >
        <RiRobot2Fill className="h-6 w-6" />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs">끄글봇</div>
        <div className="flex flex-col items-start gap-1 max-w-[80%] min-w-[2rem] ">
          {chats.map(({ isWord, isDebug, content }, i) => (
            <ChatContent
              key={i}
              className={cn(
                "bg-muted text-foreground flex gap-1 items-center",
                {
                  "font-medium": isWord,
                }
              )}
            >
              {isDebug && <Bolt className="w-4 h-4 text-muted-foreground" />}
              {content}
            </ChatContent>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full items-end gap-1">
      {chats.map(({ isWord, moveIdx, content }, i) => (
        <div
          className="flex justify-end items-center max-w-[80%] min-w-[2rem] "
          key={i}
        >
          {isWord && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {}}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>무르기</DialogTitle>
                  <DialogDescription>
                    '{content}'{josa(content as string, "을/를").at(-1)}{" "}
                    무르겠습니까?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      취소
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        killWorker();
                        startWorker();
                        const chatIdx = getChatIdxByMoveIdx(
                          currGame!.chats,
                          moveIdx!
                        );
                        if (currGame!.isPlaying) {
                          const newCurrGame = {
                            ...currGame!,
                            moves: [...currGame!.moves.slice(0, moveIdx)],
                            chats: [...currGame!.chats.slice(0, chatIdx)],
                          };
                          setCurrGame(newCurrGame);
                        } else {
                          const newCurrGame = {
                            ...currGame!,
                            moves: [...currGame!.moves.slice(0, moveIdx)],
                            chats: [...currGame!.chats.slice(0, chatIdx)],
                            isPlaying: true,
                            winner: undefined,
                          };
                          setCurrGame(newCurrGame);
                          setGames(games.slice(0, -1));
                        }
                      }}
                      type="button"
                    >
                      확인
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <ChatContent
            key={i}
            className={cn("bg-primary text-background", {
              "font-medium": isWord,
            })}
          >
            {content}
          </ChatContent>
        </div>
      ))}
    </div>
  );
}

function ChatContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl py-1 px-2 flex justify-center ", className)}>
      {children}
    </div>
  );
}
