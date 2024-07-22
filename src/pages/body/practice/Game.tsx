import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import { useWC } from "@/lib/store/useWC";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Game() {
  const [chats, setChats, moves, setMoves, engine, isFirst] = useWC((e) => [
    e.chats,
    e.setChats,
    e.moves,
    e.setMoves,
    e.engine,
    e.isFirst,
  ]);
  const [value, setValue] = useState<string>("");
  const isValid = (value: string): boolean => {
    const isMyTurn = moves.length % 2 !== +isFirst!;

    if (!isMyTurn) {
      return false;
    }
    if (!/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(value)) {
      return false;
    }
    if (moves.length > 0) {
      const chars =
        engine?.charInfo[moves.at(-1)!.at(engine.rule.tailIdx)!].chanSucc!;
      if (
        moves.length === 1 &&
        moves[0] !== value &&
        !chars.includes(value.at(engine!.rule.headIdx)!)
      ) {
        return false;
      } else if (history.length > 1) {
        if (!chars.includes(value.at(engine?.rule.headIdx!)!)) {
          return false;
        } else if (moves.includes(value)) {
          return false;
        }
      }
    }
    if (!engine!.words.includes(value)) {
      return false;
    }
    return true;
  };
  const onSend = () => {
    const trimed = value.trim();
    if (trimed.length) {
      setChats([...chats, { isMy: true, content: trimed }]);

      if (isValid(value)) {
        setMoves([trimed]);
      }
      console.log(1);
    }
    setValue("");
  };

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
  }, [chats]);
  const handleOnScroll = () => {
    if (scrollRef) {
      const isScroll =
        scrollRef.current.scrollTop <
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight - 10;
      setUserScrolled(isScroll);
    }
  };

  return (
    <div
      className="h-full min-h-0 overflow-y-auto flex flex-col"
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className="flex flex-col p-3 pb-1 flex-1 gap-1">
        {chats.map(({ isMy, content }, i) => (
          <Chat key={i} isMy={isMy}>
            {content}
          </Chat>
        ))}
      </div>
      <div className="sticky w-full bottom-0 flex flex-col">
        {moves.length > 0 && (
          <div className="flex gap-1 border-y border-border bg-none p-2 items-center overflow-auto scrollbar-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {moves.map((e, i) => (
              <React.Fragment key={i}>
                <div className="text-xs whitespace-nowrap">{e}</div>
                {i !== moves.length - 1 && (
                  <div className="text-muted-foreground">{">"}</div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="p-2 pt-2 bg-background">
          <div className="relative">
            <Input
              className="bg-accent focus-visible:ring-offset-0 pr-12 relative h-12"
              type="search"
              placeholder="단어를 입력해 주세요."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  if (e.nativeEvent.isComposing) {
                    return;
                  }
                  onSend();
                }
              }}
            />
            <Button
              size="icon"
              className="absolute right-1 w-[2.4rem] h-[2.4rem] top-[calc(50%-1.2rem)] flex items-center justify-center"
            >
              <SendHorizonal
                className="w-[1.2rem] h-[1.2rem]"
                onClick={onSend}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
