import type { NodeType } from "@/lib/wordchain/graph/graph";
import type React from "react";
import CharButton from "./char-button";
import CharCard from "./char-card";

export function CharSection({ children }: React.ComponentProps<"div">) {
  return <div className="space-y-2">{children}</div>;
}

export function Title({ children }: React.ComponentProps<"div">) {
  return <div className="text-sm">{children}</div>;
}

export function CharList({
  charsData,
}: {
  charsData: { char: string; type: NodeType }[];
}) {
  return (
    <CharCard>
      {charsData.map(({ char, type }) => (
        <CharButton variant={type} key={char} className="size-9 font-normal">
          {char}
        </CharButton>
      ))}
    </CharCard>
  );
}
