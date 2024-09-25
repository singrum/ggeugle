import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWC } from "@/lib/store/useWC";
import { chatSplit, cn } from "@/lib/utils";
import { changeableMap } from "@/lib/wc/changeables";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChevronRight, Flag, Plus, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";

export default function Game() {
  const [currGame, isChatLoading] = useWC((e) => [e.currGame, e.isChatLoading]);

  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState<boolean>(false);

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);
  useEffect(() => {
    if (scrollRef.current && !userScrolled) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [currGame!.chats]);
  const handleOnScroll = () => {
    if (scrollRef) {
      const isScroll =
        scrollRef.current.scrollTop <
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight - 10;
      setUserScrolled(isScroll);
    }
  };
  const splitedChats = chatSplit(
    !isChatLoading
      ? currGame!.chats
      : [
          ...currGame!.chats,
          {
            isMy: false,
            content: (
              <div className="flex gap-2 px-2 py-1.5">
                {[2, 1, 0].map((e) => (
                  <span className="relative flex h-3 w-3" key={e}>
                    <span
                      className={`animate-[chat-loading_0.7s_ease-in-out_${
                        -e * 0.15
                      }s_infinite] absolute inline-flex h-full w-full rounded-full bg-foreground/70`}
                    />
                  </span>
                ))}
              </div>
            ),
          },
        ]
  );

  return (
    <div className="flex flex-col min-h-0 h-full">
      <GameHeader />
      <div
        className="flex-1 h-full min-h-0 overflow-y-auto flex flex-col scrollbar-none"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex flex-col p-3 pb-2 flex-1 gap-2 justify-end">
          {splitedChats.map(({ isMy, contents }, i) => {
            console.log(splitedChats.length - 1, i);
            return (
              <Chat key={i} isMy={isMy}>
                {contents}
              </Chat>
            );
          })}
        </div>
        <GameInput />
      </div>
    </div>
  );
}
function GameInput() {
  const [value, setValue] = useState<string>("");
  const [currGame, setCurrGame, makeMyMove, originalEngine] = useWC((e) => [
    e.currGame,
    e.setCurrGame,
    e.makeMyMove,
    e.originalEngine,
  ]);
  const isValid = (value: string): boolean => {
    const isMyTurn = currGame!.moves.length % 2 !== +currGame!.isFirst!;

    if (!isMyTurn) {
      return false;
    }
    if (!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(value)) {
      return false;
    }
    if (currGame!.moves.length > 0) {
      const chars = changeableMap[originalEngine!.rule.changeableIdx](
        currGame!.moves.at(-1)!.at(originalEngine!.rule.tailIdx)!
      );

      if (
        currGame!.moves.length === 1 &&
        currGame!.moves[0] !== value &&
        !chars.includes(value.at(originalEngine!.rule.headIdx)!)
      ) {
        return false;
      } else if (currGame!.moves.length > 1) {
        if (!chars.includes(value.at(originalEngine?.rule.headIdx!)!)) {
          return false;
        } else if (currGame!.moves.includes(value)) {
          return false;
        }
      }
    }
    if (!originalEngine!.words.includes(value)) {
      return false;
    }
    return true;
  };
  const onSend = () => {
    const trimed = value.trim();
    if (trimed.length) {
      if (currGame!.moves.length > 1 && currGame!.moves.includes(value)) {
        setCurrGame({
          ...currGame!,
          chats: [
            ...currGame!.chats,
            { isMy: true, content: trimed },
            { isMy: false, content: "이미 사용한 단어입니다." },
          ],
        });
      } else {
        setCurrGame({
          ...currGame!,
          chats: [...currGame!.chats, { isMy: true, content: trimed }],
        });
        if (isValid(value)) {
          makeMyMove(trimed);
        }
      }
    }
    setValue("");
  };

  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollWidth,
        behavior: "instant",
      });
    }
  }, [currGame!.moves]);

  return (
    <div className="sticky w-full bottom-0 flex flex-col border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-b-xl">
      {currGame!.moves.length > 0 && (
        <div
          ref={ref}
          className="flex gap-1 bg-none p-2 items-center min-w-0 overflow-auto scrollbar-none border-t "
        >
          {currGame!.moves.map((e, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "text-xs whitespace-nowrap text-muted-foreground",
                  {
                    "text-foreground font-semibold":
                      i === currGame!.moves.length - 1,
                  }
                )}
              >
                {e}
              </div>
              {i !== currGame!.moves.length - 1 && (
                <div className="text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <Separator />
      <div className="p-1 bg-muted/40 rounded-b-xl">
        <div className="relative">
          <Input
            disabled={!currGame!.isPlaying}
            className="bg-transparent border-none outline-none focus-visible:ring-offset-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 pr-12 relative h-12 text-base"
            type="search"
            placeholder="단어를 입력해 주세요."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.nativeEvent.isComposing) {
                  return;
                }

                onSend();
              }
            }}
          />
          <Button
            disabled={!currGame!.isPlaying || value.trim().length === 0}
            size="icon"
            className="absolute right-1 w-[2.4rem] h-[2.4rem] top-[calc(50%-1.2rem)] flex items-center justify-center rounded-full"
          >
            <SendHorizonal className="w-[1.2rem] h-[1.2rem]" onClick={onSend} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function GameHeader() {
  const [currGame, setCurrGame] = useWC((e) => [e.currGame, e.setCurrGame]);
  return (
    <>
      <div className="w-full flex items-center px-2 py-1 justify-between border-b border-border text-accent-foreground">
        <div className="flex items-center gap-1 px-2 py-2 font-semibold ">
          플레이 중
        </div>

        <div className="flex gap-1">
          <div
            className="flex items-center justify-center p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
            onClick={() => {
              if (currGame!.isPlaying) {
                document.getElementById("new-game-dialog")!.click();
              } else {
                setCurrGame(undefined);
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </div>
          <div
            className="flex items-center justify-center p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
            onClick={() => {
              if (currGame!.isPlaying) {
                document.getElementById("resign-dialog")!.click();
              } else {
                setCurrGame(undefined);
              }
            }}
          >
            <Flag className="w-4 h-4" />
          </div>
        </div>
      </div>
      <NewGameDialog />
      <ResignDialog />
    </>
  );
}

function NewGameDialog() {
  const setCurrGame = useWC((e) => e.setCurrGame);
  return (
    <Dialog>
      <DialogTrigger>
        <div className="absolute hidden" id="new-game-dialog" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게임</DialogTitle>
          <DialogDescription>
            플레이 중인 게임이 삭제됩니다. 계속하시겠습니까?
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
                setCurrGame(undefined);
              }}
              type="button"
            >
              확인
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResignDialog() {
  const [setCurrGame, currGame, games, setGames] = useWC((e) => [
    e.setCurrGame,
    e.currGame,
    e.games,
    e.setGames,
  ]);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="absolute hidden" id="resign-dialog" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기권</DialogTitle>
          <DialogDescription>기권하시겠습니까?</DialogDescription>
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
                const newCurrGame = { ...currGame!, isPlaying: false };
                setCurrGame(undefined);
                setGames([...games, newCurrGame]);
              }}
              type="button"
            >
              확인
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}