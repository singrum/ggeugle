import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { maxMinComp } from "@/constants/search";
import { useWcStore } from "@/stores/wc-store";
import type { RouteCharListData, WinloseCharListData } from "@/types/search";
import { range } from "lodash";
import React, { Fragment, type ReactNode } from "react";
import { Ball } from "../ball";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
export function WinloseCharSectionList({
  nodeType,
  charListData,
}: {
  nodeType: "win" | "lose" | "loopwin";
  charListData: WinloseCharListData;
}) {
  const colorVariable = {
    win: { bgColor: "bg-win", textColor: "text-win hover:text-win" },
    lose: { bgColor: "bg-lose", textColor: "text-lose hover:text-lose" },
    loopwin: {
      bgColor: "bg-loopwin",
      textColor: "text-loopwin hover:text-loopwin",
    },
  };

  return (
    <CharSectionList
      components={charListData.map(({ depth, nodes }) => (
        <CharSection key={depth}>
          <CharSectionTitle>{`${depth} 수 이내 ${nodeType !== "lose" ? "승리" : "패배"}`}</CharSectionTitle>
          <CharList>
            {nodes.map((char) => (
              <CharButton
                key={char}
                className={cn(colorVariable[nodeType].textColor)}
              >
                {char}
              </CharButton>
            ))}
          </CharList>
        </CharSection>
      ))}
    />
  );
}

export function RouteCharSectionList({
  charListData,
}: {
  charListData: RouteCharListData;
}) {
  return (
    <CharSectionList
      components={[0, 1]
        .filter((e) => charListData[e].length > 0)
        .map((e) => (
          <CharSection key={`${e}`}>
            <CharSectionTitle>{maxMinComp[e].title}</CharSectionTitle>
            <CharList>
              {charListData[e].map((char) => (
                <CharButton
                  key={char}
                  className={cn("text-route hover:text-route")}
                >
                  {char}
                </CharButton>
              ))}
            </CharList>
          </CharSection>
        ))}
    />
  );
}

export function CharSectionList({ components }: { components: ReactNode[] }) {
  return (
    <div className="flex flex-col">
      {components.map((e, i) => (
        <Fragment key={i}>
          {e}

          {components.length - 1 !== i && <Separator className="my-8" />}
        </Fragment>
      ))}
    </div>
  );
}

export function CharSectionListLoading() {
  return (
    <CharSectionList
      components={[
        <CharSection>
          <CharList className="gap-2">
            {range(100).map((i) => (
              <Skeleton className="h-8 w-8" key={i}></Skeleton>
            ))}
          </CharList>
        </CharSection>,
      ]}
    />
  );
}

export function CharSection({ children }: React.ComponentProps<"div">) {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
}
export function CharSectionTitle({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <Badge variant="secondary" className={cn("rounded-sm", className)}>
      {children}
    </Badge>
  );
}

export function CharList({ className, children }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-center", className)}
    >
      {children}
    </div>
  );
}

export function CharButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const search = useWcStore((e) => e.search);
  const comparisonMap = useWcStore((e) => e.comparisonMap);
  const view = useWcStore((e) => e.view);
  const setCharListDrawerOpen = useWcStore((e) => e.setCharListDrawerOpen);

  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const cmp = comparisonMap?.[view].get(children as string);

  return (
    <Button
      onClick={() => {
        search(children as string);
        setCharListDrawerOpen(false);
      }}
      variant="ghost"
      className={cn(
        "relative size-10 text-lg",
        {
          "bg-accent dark:bg-accent/50": searchInputValue === children,
        },
        className,
      )}
      {...props}
    >
      {children}
      {cmp && (
        <Ball variant={cmp[1]} className="absolute top-1.5 left-1.5 size-1.5" />
      )}
    </Button>
  );
}
