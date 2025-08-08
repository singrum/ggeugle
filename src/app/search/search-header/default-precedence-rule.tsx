import { Toggle } from "@/components/ui/toggle";
import { useWcStore } from "@/stores/wc-store";
import { Check } from "lucide-react";

const info = [
  "다음 단어 적은 순",
  "(다음 단어 - 이전 단어) 작은 순",
  "(다음 단어 / 이전 단어) 작은 순",
];
export default function DefaultPrecedenceRule() {
  const rule = useWcStore((e) => e.prec.rule);
  console.log(useWcStore.getState().prec);
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">기본 우선순위</div>

      <div className="flex flex-col gap-2">
        {info.map((e, i) => (
          <Toggle
            key={i}
            variant="outline"
            pressed={i === rule}
            onClick={() =>
              useWcStore.setState((e) => {
                e.prec.rule = i;
              })
            }
            className="justify-start py-4"
          >
            <Check />
            {e}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
