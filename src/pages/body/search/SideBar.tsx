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
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { WCDisplay } from "@/lib/wc/wordChain";
import React, { useMemo, useState } from "react";
import ScrollSpy from "react-scrollspy-navigation";

const orders = ["n턴 후 승리", "빈도 순"];

export default function SideBar() {
  const [order, setOrder] = useState<string>("0");

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <CharMenu />
        <div className="flex-1 overflow-auto scrollbar-none px-2 pb-2 bg-background h-full">
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

          {order === "0" ? <EndInN /> : <Frequency />}
        </div>
      </div>
    </>
  );
}
function Frequency() {
  const engine = useWC((e) => e.engine);

  return (
    <>
      <div className="mb-2" id="win">
        {engine && (
          <>
            <CharBox>
              <CharBadge>{`승리`}</CharBadge>
              <CharContent>
                {Object.keys(engine.charInfo)
                  .filter(
                    (e) =>
                      engine.charInfo[e].type === "win" ||
                      engine.charInfo[e].type === "wincir"
                  )
                  .sort(
                    (a, b) =>
                      engine.charInfo[b].inWords.length -
                      engine.charInfo[a].inWords.length
                  )
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="win" className={`text-win`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {engine.charInfo[char].inWords.length.toLocaleString()}
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
        {engine && (
          <>
            <CharBox>
              <CharBadge>{`패배`}</CharBadge>
              <CharContent>
                {Object.keys(engine.charInfo)
                  .filter(
                    (e) =>
                      engine.charInfo[e].type === "los" ||
                      engine.charInfo[e].type === "loscir"
                  )
                  .sort(
                    (a, b) =>
                      engine.charInfo[b].inWords.length -
                      engine.charInfo[a].inWords.length
                  )
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="los" className={`text-los`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {engine.charInfo[char].inWords.length.toLocaleString()}
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
        {engine && (
          <>
            <CharBox>
              <CharBadge>{`루트`}</CharBadge>
              <CharContent>
                {Object.keys(engine.charInfo)
                  .filter((e) => engine.charInfo[e].type === "route")
                  .sort(
                    (a, b) =>
                      engine.charInfo[b].inWords.length -
                      engine.charInfo[a].inWords.length
                  )
                  .map((char) => (
                    <div className="flex flex-col items-center" key={char}>
                      <CharButton type="route" className={`text-route`}>
                        {char}
                      </CharButton>
                      <div className="text-muted-foreground text-xs">
                        {engine.charInfo[char].inWords.length.toLocaleString()}
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
  const wcd = useMemo(() => {
    if (engine) {
      const wcd = WCDisplay.endInN(engine!);

      return wcd;
    } else {
      return;
    }
  }, [engine]);
  // console.log(wcd);
  return (
    <>
      {engine && wcd ? (
        <>
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

const CharMenus: {
  name: string;
  color: string;
}[] = [
  { name: "승리", color: "win" },
  { name: "패배", color: "los" },
  { name: "루트", color: "route" },
];

function CharMenu() {
  const [menu, setMenu] = useState<number>(0);
  return (
    <ScrollSpy
      onChangeActiveId={(curr) => {
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
                { [`border-${e.color}`]: menu === i }
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
