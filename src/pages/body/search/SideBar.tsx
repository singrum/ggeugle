import {
  CharBadge,
  CharBox,
  CharButton,
  CharContent,
} from "@/components/ui/CharBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { charMenuList, useCharMenu } from "@/lib/store/useCharMenu";
import { useSheet } from "@/lib/store/useSheet";

import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { WCDisplay } from "@/lib/wc/WordChain";
import { CircleHelp } from "lucide-react";
import React, { useMemo, useState } from "react";
const orders = ["n 턴 이내 승리", "끝나는 단어 개수", "시작 단어 개수"];

export function SideBar() {
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <CharMenu />
        <Content />
      </div>
    </>
  );
}

export function Content() {
  const [order, setOrder] = useState<string>("0");
  const charMenu = useCharMenu((e) => e.charMenu);
  return (
    <div className="px-2 bg-background overflow-auto scrollbar-none">
      <div className="flex gap-2 justify-between pt-3 items-center">
        <div className="pl-3 flex items-center">
          <Popover>
            <PopoverTrigger className=" underline-offset-4 underline decoration-dashed hover:no-underline text-foreground font-medium text-sm whitespace-nowrap">
              {charMenuList[charMenu].name} 음절
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              {charMenuList[charMenu].desc}
            </PopoverContent>
          </Popover>
        </div>
        <Select defaultValue="0" onValueChange={(e) => setOrder(e)}>
          <SelectTrigger className="w-fit text-xs border-0 px-2 py-1 h-fit focus:ring-offset-1 focus-ring-1 shrink">
            <div className="text-muted-foreground mr-1 whitespace-nowrap">
              정렬:
            </div>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {orders.map((e, i) => (
              <SelectItem value={`${i}`} key={i} className="text-xs">
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        {order === "0" ? (
          <EndInN />
        ) : order === "1" ? (
          <EndsWithNum />
        ) : (
          <StartsWithNum />
        )}
      </div>
    </div>
  );
}
function StartsWithNum() {
  const engine = useWC((e) => e.engine);
  const charMenu = useCharMenu((e) => e.charMenu);

  const inWordsLen = useMemo(() => {
    if (!engine) {
      return;
    }
    const result = WCDisplay.startsWithNum(engine);

    return result;
  }, [engine]);
  return (
    <>
      <div className="md:mt-2">
        {engine && inWordsLen && charMenu === 0 && (
          <>
            <CharBox>
              <CharBadge>{`승리`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter(
                    (e) =>
                      engine.chanGraph.nodes[e].type === "win" ||
                      engine.chanGraph.nodes[e].type === "wincir"
                  )
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="win" className={`text-win`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>
      <div className="">
        {engine && inWordsLen && charMenu === 1 && (
          <>
            <CharBox>
              <CharBadge>{`패배`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter(
                    (e) =>
                      engine.chanGraph.nodes[e].type === "los" ||
                      engine.chanGraph.nodes[e].type === "loscir"
                  )
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="los" className={`text-los`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>

      <div className="">
        {engine && inWordsLen && charMenu === 2 && (
          <>
            <CharBox>
              <CharBadge>{`루트`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter((e) => engine.chanGraph.nodes[e].type === "route")
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="route" className={`text-route`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>
    </>
  );
}
function EndsWithNum() {
  const engine = useWC((e) => e.engine);
  const charMenu = useCharMenu((e) => e.charMenu);

  const inWordsLen = useMemo(() => {
    if (!engine) {
      return;
    }
    const result = WCDisplay.endsWithNum(engine);

    return result;
  }, [engine]);
  return (
    <>
      <div className="md:mt-2">
        {engine && inWordsLen && charMenu === 0 && (
          <>
            <CharBox>
              <CharBadge>{`승리`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter(
                    (e) =>
                      engine.chanGraph.nodes[e].type === "win" ||
                      engine.chanGraph.nodes[e].type === "wincir"
                  )
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="win" className={`text-win`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>
      <div className="">
        {engine && inWordsLen && charMenu === 1 && (
          <>
            <CharBox>
              <CharBadge>{`패배`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter(
                    (e) =>
                      engine.chanGraph.nodes[e].type === "los" ||
                      engine.chanGraph.nodes[e].type === "loscir"
                  )
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="los" className={`text-los`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>

      <div className="">
        {engine && inWordsLen && charMenu === 2 && (
          <>
            <CharBox>
              <CharBadge>{`루트`}</CharBadge>
              <CharContent>
                {Object.keys(engine.chanGraph.nodes)
                  .filter((e) => engine.chanGraph.nodes[e].type === "route")
                  .sort((a, b) => inWordsLen[b] - inWordsLen[a])
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="route" className={`text-route`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {inWordsLen[char].toLocaleString()}
                      </div>
                    </div>
                  ))}
              </CharContent>
            </CharBox>

            <Separator className="my-2" />
          </>
        )}
      </div>
    </>
  );
}

function EndInN() {
  const engine = useWC((e) => e.engine);
  const charMenu = useCharMenu((e) => e.charMenu);
  const wcd = useMemo(() => {
    if (engine) {
      const wcd = WCDisplay.endInN(engine!);

      return wcd;
    } else {
      return;
    }
  }, [engine]);

  return (
    <>
      {engine && wcd ? (
        <>
          {charMenu === 0 && (
            <div className="md:mt-2">
              {wcd.win.map((e) => (
                <React.Fragment key={e.endNum}>
                  <CharBox>
                    <CharBadge>{`${e.endNum} 턴 이내 승리`}</CharBadge>
                    <CharContent>
                      {e.chars.map((char) => (
                        <CharButton type="win" key={char}>
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          )}
          {charMenu === 1 && (
            <div className="md:mt-2">
              {wcd.los.map((e) => (
                <React.Fragment key={e.endNum}>
                  <CharBox>
                    <CharBadge>{`${e.endNum} 턴 이내 패배`}</CharBadge>
                    <CharContent>
                      {e.chars.map((char) => (
                        <CharButton type="los" key={char}>
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          )}
          {charMenu === 2 && (
            <div className="md:mt-2">
              {wcd.route.maxComp.length > 0 && (
                <>
                  <CharBox>
                    <Popover>
                      <PopoverTrigger className="">
                        <CharBadge>
                          {`주요 루트 음절`}
                          <CircleHelp className="w-4 h-4 ml-1" />
                        </CharBadge>
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <div className="flex flex-col gap-1">
                          <div>
                            게임 진행 시{" "}
                            <span className="font-semibold">
                              여러 번 나올 수 있는
                            </span>{" "}
                            루트 음절.
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <CharContent>
                      {wcd.route.maxComp.map((char) => (
                        <CharButton type="route" key={char}>
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </>
              )}
              {wcd.route.minComp.length > 0 && (
                <>
                  <CharBox>
                    <Popover>
                      <PopoverTrigger>
                        <CharBadge>
                          {`희귀 루트 음절`}
                          <CircleHelp className="w-4 h-4 ml-1" />
                        </CharBadge>
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <div className="flex flex-col gap-1">
                          <div>
                            게임 진행 시{" "}
                            <span className="font-semibold">
                              여러 번 나올 수 없는
                            </span>{" "}
                            루트 음절.
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <CharContent>
                      {wcd.route.minComp.map((char) => (
                        <CharButton type="route" key={char}>
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mb-2">
          <CharBox>
            <CharContent>
              {Array.from({ length: 500 }, (_, i) => (
                <Skeleton className="h-8 w-8 m-1" key={i} />
              ))}
            </CharContent>
          </CharBox>
          <Separator className="my-2" />
        </div>
      )}
    </>
  );
}

export function CharMenu() {
  const [charMenu, setCharMenu] = useCharMenu((e) => [
    e.charMenu,
    e.setCharMenu,
  ]);
  const [sheetRef, setOpen] = useSheet((e) => [e.sheetRef, e.setOpen]);
  return (
    <>
      <ul className="grid grid-cols-3 justify-center select-none border-border border-b  p-1.5 md:p-2">
        {charMenuList.map((e, i) => (
          <React.Fragment key={i}>
            <div
              onClick={() => {
                setCharMenu(i);
                if (
                  sheetRef.current &&
                  sheetRef.current.height > 70 &&
                  charMenu === i
                ) {
                  setOpen(false);
                }
              }}
              className={cn(
                "flex justify-center items-center cursor-pointer whitespace-nowrap relative"
              )}
            >
              {(i === 1 || i === 2) && (
                <Separator
                  orientation="vertical"
                  className="h-6 relative z-0"
                />
              )}
              <div
                className={cn(
                  `w-full py-2 rounded-lg text-center text-md relative z-10 text-muted-foreground `,
                  {
                    [`outline outline-${e.color} shadow bg-${e.color}/10`]:
                      charMenu === i,
                    [`text-${e.color} font-medium`]: charMenu === i,
                  }
                )}
              >
                {charMenuList[i].name}
              </div>
            </div>
          </React.Fragment>
        ))}
      </ul>
    </>
  );
}
