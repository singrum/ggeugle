import {
  CharBadge,
  CharBox,
  CharButton,
  CharContent,
} from "@/components/ui/CharBox";
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

import { useWC } from "@/lib/store/useWC";
import { arrayToKeyMap, cn } from "@/lib/utils";
import { changeableMap } from "@/lib/wc/hangul";
import { WCDisplay } from "@/lib/wc/wordChain";
import React, { useMemo, useState } from "react";

const orders = ["n턴 후 승리", "빈도 순"];

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
    <div className="flex-1 overflow-auto px-2 pb-2 bg-background h-full">
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
      <div id="scrollspy-root">
        {order === "0" ? <EndInN /> : <Frequency />}
      </div>
    </div>
  );
}

function Frequency() {
  const engine = useWC((e) => e.engine);
  const charMenu = useCharMenu((e) => e.charMenu);
  const charSort = useCharMenu((e) => e.charSort);
  const inWordsLen = useMemo(() => {
    if (!engine) {
      return;
    }
    const result = WCDisplay.frequency(engine);

    return result;
  }, [engine]);
  return (
    <>
      <div className="mb-2">
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
      <div className="mb-2" id="los">
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

      <div className="" id="route">
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
            <div className="mb-2" id="win">
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
            </div>
          )}
          {charMenu === 1 && (
            <div className="mb-2" id="los">
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
            </div>
          )}
          {charMenu === 2 && (
            <div className="" id="route">
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
  return (
    <ul className="grid grid-cols-3 justify-center">
      {charMenuList.map((e, i) => (
        <React.Fragment key={i}>
          <div
            onClick={() => setCharMenu(i)}
            className={cn(
              "flex justify-center items-center cursor-pointer py-2 border-b border-border overflow-hidden whitespace-nowrap",
              { [`border-${e.color}`]: charMenu === i }
            )}
          >
            <div
              className={cn("text-muted-foreground", {
                [`text-${e.color} font-bold`]: charMenu === i,
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
