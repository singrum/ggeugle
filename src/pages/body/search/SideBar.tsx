import {
  CharBadge,
  CharBox,
  CharButton,
  CharContent,
} from "@/components/ui/CharBox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import ScrollSpy from "react-scrollspy-navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOS, LOSCIR, ROUTE, WIN, WINCIR } from "@/lib/wc/WordChain";
const order = ["n턴 후 승리", "가나다 순", "빈도 순"];

export default function SideBar() {
  const [order, setOrder] = useState<string>("0");

  return (
    <>
      <div className="h-full w-full flex flex-col bg-muted/40">
        <div className="flex flex-col">
          {/* <div className="text-xl p-3 pb-1">글자</div> */}
          <div className="flex items-center p-3 gap-2">
            <div className="text-muted-foreground">정렬 방법</div>
            <Select defaultValue="0" onValueChange={(e) => setOrder(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">n턴 후 승리</SelectItem>
                <SelectItem value="1">빈도 순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CharMenu />
        <div className="flex-1 overflow-auto scrollbar-none px-2 pb-2 bg-background">
          {/* <EndInN /> */}
          {order === "0" ? <EndInN /> : <Frequency />}
        </div>
      </div>
    </>
  );
}
function Frequency() {
  const chars = useWC((e) => e.charClass);

  return (
    <>
      <div className="mb-2" id="win">
        {chars && (
          <>
            <CharBox>
              <CharBadge>{`공격단어`}</CharBadge>
              <CharContent
                charInfo={chars.frequency.win.map((char) => ({
                  char,
                  type: "win",
                }))}
              />
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>
      <div className="mb-2" id="los">
        {chars && (
          <>
            <CharBox>
              <CharBadge>{`방어단어`}</CharBadge>
              <CharContent
                charInfo={chars.frequency.los.map((char) => ({
                  char,
                  type: "los",
                }))}
              />
            </CharBox>
            <Separator className="my-2" />
          </>
        )}
      </div>

      <div className="" id="route">
        {chars && (
          <>
            <CharBox>
              <CharBadge>{`루트단어`}</CharBadge>
              <CharContent
                charInfo={chars.frequency.route.map((char) => ({
                  char,
                  type: "route",
                }))}
              />
            </CharBox>
          </>
        )}
      </div>
    </>
  );
}

function EndInN() {
  const chars = useWC((e) => e.charClass);

  return (
    <>
      <div className="mb-2" id="win">
        {chars && (
          <>
            {chars.endInN.win.map((e) => (
              <React.Fragment key={e.key}>
                <CharBox key={e.key}>
                  <CharBadge>
                    {e.key === "wincir" ? `조건부 승리` : `${e.key}턴 후 승리`}
                  </CharBadge>
                  <CharContent
                    charInfo={e.chars.map((char) => ({
                      char,
                      type: "win",
                    }))}
                  />
                </CharBox>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      <div className="mb-2" id="los">
        {chars && (
          <>
            {chars.endInN.los.map((e) => (
              <React.Fragment key={e.key}>
                <CharBox key={e.key}>
                  <CharBadge>
                    {e.key === "loscir" ? `조건부 패배` : `${-e.key}턴 후 패배`}
                  </CharBadge>
                  <CharContent
                    charInfo={e.chars.map((char) => ({
                      char,
                      type: "los",
                    }))}
                  />
                </CharBox>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      <div className="" id="route">
        {chars && (
          <>
            <CharBox>
              <CharBadge>루트단어</CharBadge>
              <div className="flex flex-wrap gap-y-1 text-xl justify-center items-center text-muted">
                {chars.endInN.route.map((e, index) => (
                  <React.Fragment key={index}>
                    {e.map((char, i) => (
                      <CharButton
                        className={cn(`text-route mr-1`, {
                          "mr-0": i === e.length - 1,
                        })}
                        key={char}
                      >
                        {char}
                      </CharButton>
                    ))}
                    {index !== chars.endInN.route.length - 1 ? `/` : undefined}
                  </React.Fragment>
                ))}
              </div>
            </CharBox>
          </>
        )}
      </div>
    </>
  );
}

const CharMenus: {
  name: string;
  color: string;
}[] = [
  { name: "공격단어", color: "win" },
  { name: "방어단어", color: "los" },
  { name: "루트단어", color: "route" },
];

function CharMenu() {
  const [menu, setMenu] = useState<number>(0);
  return (
    <ScrollSpy
      onChangeActiveId={(curr, prev) => {
        setMenu(curr === "route" ? 2 : curr === "los" ? 1 : 0);
      }}
    >
      <ul className="grid grid-cols-3 justify-center">
        {CharMenus.map((e, i) => (
          <React.Fragment key={i}>
            <a
              href={`#${e.color}`}
              className={cn(
                "flex justify-center items-center cursor-pointer py-2 border-b border-border overflow-hidden whitespace-nowrap",
                { ["border-foreground"]: menu === i }
              )}
            >
              <div
                className={cn("text-muted-foreground", {
                  [`text-${e.color} font-bold`]: menu === i,
                })}
              >
                {e.name}
              </div>
            </a>
          </React.Fragment>
        ))}
      </ul>
    </ScrollSpy>
  );
}
