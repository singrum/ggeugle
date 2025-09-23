import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { StrategySearchSlice } from "@/stores/types/wc-store";

import { useWcStore } from "@/stores/wc-store";
import { Star } from "lucide-react";
import { useState } from "react";

const info: {
  title: string; // The description of the precedence rule.
  recommend: boolean; // Indicates whether the rule is recommended.
}[] = [
  { title: "다음 단어 적은 순", recommend: true },
  { title: "이전 단어 많은 순", recommend: false },
  { title: "(다음 단어 - 이전 단어) 작은 순", recommend: false },
  { title: "(다음 단어 / 이전 단어) 작은 순", recommend: true },
  { title: "임계 단어까지 거리 짧은 순", recommend: false },
  { title: "다음 음절 개수 적은 순", recommend: true },
  { title: "(다음 음절 / 이전 음절) 작은 순", recommend: false },
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
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">기본 우선순위</div>
          <Select
            value={String(localRule)}
            onValueChange={(val) => setLocalRule(Number(val))}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                {info[localRule]?.title || "우선순위 규칙 선택"}
                {info[localRule]?.recommend && (
                  <Star className="h-4 w-4 text-yellow-400" />
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              {info.map(({ title, recommend }, i) => (
                <SelectItem key={i} value={String(i)}>
                  <div className="flex items-center gap-2">
                    {title}
                    {recommend && <Star className="h-4 w-4 text-yellow-400" />}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Label className="flex flex-col items-start gap-2">
          <div className="text-sm font-medium">미니맥스 깊이</div>

          <Input
            type="number"
            className="w-full max-w-[100px] font-normal"
            value={localDepth}
            onChange={(e) => setLocalDepth(Number(e.target.value))}
          />
        </Label>
      </div>

      <Button onClick={save} size="lg" className="mb-6 w-full lg:mb-0">
        저장
      </Button>
    </div>
  );
}
