import {
  CharBadge,
  CharBox,
  CharButton,
  CharContent,
} from "@/components/ui/CharBox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import React, { useMemo, useState } from "react";

const orders = ["n턴 후 승리", "끝나는 단어 개수", "시작 단어 개수"];

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
  return (
    <ScrollArea className="px-2 bg-background">
      {/* <div className="flex-1 overflow-auto px-2 pb-2 bg-background h-full "> */}
      <div className="flex gap-2 justify-end pt-3">
        <Select defaultValue="0" onValueChange={(e) => setOrder(e)}>
          <SelectTrigger className="w-fit text-xs border-0 px-2 py-1 h-fit focus:ring-offset-1 focus-ring-1">
            <div className="text-muted-foreground mr-1">정렬:</div>
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
      {/* </div> */}
    </ScrollArea>
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
                    <CharBadge>{`${e.endNum}턴 후 승리`}</CharBadge>
                    <CharContent>
                      {e.chars.map((char) => (
                        <CharButton type="win" key={char} className="text-win">
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
              {wcd.wincir.length > 0 && (
                <>
                  <CharBox>
                    <CharBadge>{`조건부 승리`}</CharBadge>
                    <CharContent>
                      {wcd.wincir.map((char) => (
                        <CharButton type="win" key={char} className="text-win">
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
          {charMenu === 1 && (
            <div className="md:mt-2">
              {wcd.los.map((e) => (
                <React.Fragment key={e.endNum}>
                  <CharBox>
                    <CharBadge>{`${e.endNum}턴 후 패배`}</CharBadge>
                    <CharContent>
                      {e.chars.map((char) => (
                        <CharButton type="los" key={char} className="text-los">
                          {char}
                        </CharButton>
                      ))}
                    </CharContent>
                  </CharBox>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
              {wcd.loscir.length > 0 && (
                <>
                  <CharBox>
                    <CharBadge>{`조건부 패배`}</CharBadge>
                    <CharContent>
                      {wcd.loscir.map((char) => (
                        <CharButton type="los" key={char} className="text-los">
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
          {charMenu === 2 && (
            <div className="md:mt-2">
              {wcd.route.length > 0 && (
                <>
                  <CharBox>
                    <CharBadge>{`루트`}</CharBadge>
                    <CharContent className="gap-x-0 items-center">
                      {wcd.route.map((scc, index) => (
                        <React.Fragment key={index}>
                          {scc.map((char, i) => (
                            <CharButton
                              type="route"
                              className={cn(`text-route mr-1`, {
                                "mr-0": i === scc.length - 1,
                              })}
                              key={char}
                            >
                              {char}
                            </CharButton>
                          ))}
                          <div className="text-muted-foreground/40">
                            {index !== wcd.route.length - 1 ? `/` : undefined}
                          </div>
                        </React.Fragment>
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
  const [sheetRef] = useSheet((e) => [e.sheetRef]);
  return (
    <ul className="grid grid-cols-3 justify-center border-b border-border select-none bg-background">
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
                sheetRef.current.snapTo(
                  ({ snapPoints }: { snapPoints: number[] }) => snapPoints[2],
                  {}
                );
              }
            }}
            className={cn(
              "flex justify-center items-center cursor-pointer border-b-2 border-transparent py-2 overflow-hidden whitespace-nowrap",
              { [` border-${e.color}`]: charMenu === i }
            )}
          >
            <div
              className={cn("py-1 px-4 rounded-full text-muted-foreground", {
                [`bg-${e.color}/10 text-${e.color}`]: charMenu === i,
              })}
            >
              {charMenuList[i].name}
            </div>
          </div>
        </React.Fragment>
      ))}
    </ul>
  );
}
