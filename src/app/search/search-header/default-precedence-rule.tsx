import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import type { StrategySearchSlice } from "@/stores/types/wc-store";

import { useWcStore } from "@/stores/wc-store";
import { Check, Star } from "lucide-react";
import { useState } from "react";

const info: {
  title: string; // The description of the precedence rule.
  recommend: boolean; // Indicates whether the rule is recommended.
}[] = [
  { title: "다음 단어 적은 순", recommend: true },
  { title: "이전 단어 많은 순", recommend: false },
  { title: "(다음 단어 - 이전 단어) 작은 순", recommend: false },
  { title: "(다음 단어 / 이전 단어) 작은 순", recommend: true },
  { title: "임계단어까지 거리 짧은 순", recommend: false },
];
export default function DefaultPrecedenceRule({
  setOpen,
}: {
  setOpen: (v: boolean) => void;
}) {
  const rule = useWcStore((e) => e.prec.rule);
  const depth = useWcStore((e) => e.prec.mmDepth);
  const [localRule, setLocalRule] =
    useState<StrategySearchSlice["prec"]["rule"]>(rule);
  const [localDepth, setLocalDepth] =
    useState<StrategySearchSlice["prec"]["mmDepth"]>(depth);

  const save = () => {
    useWcStore.setState((state) => {
      state.prec.rule = localRule;
      state.prec.mmDepth = localDepth;
    });
    setOpen(false);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm font-medium">기본 우선순위</div>

        <div className="flex flex-col gap-2">
          {info.map(({ title, recommend }, i) => (
            <Toggle
              key={i}
              variant="outline"
              pressed={i === localRule}
              onClick={() => setLocalRule(i)}
              className="h-auto py-2"
            >
              <div className="flex flex-1 items-center justify-start gap-2 text-left whitespace-normal">
                <Check />
                {title}
              </div>
              {recommend && <Star />}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          <div className="text-sm font-medium">미니맥스 깊이</div>

          <div className="flex flex-col gap-2">
            <Input
              type="number"
              className="w-full max-w-[100px] font-normal"
              value={localDepth}
              onChange={(e) => setLocalDepth(Number(e.target.value))}
            />
          </div>
        </Label>
      </div>
      <Button onClick={save} size="lg" className="w-full">
        저장
      </Button>
    </div>
  );
}
