import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { useEffect } from "react";

export default function Json() {
  const value = useWcStore((e) => e.ruleJsonInputValue);
  const isValid = useWcStore((e) => e.isValidJson);
  const setValue = useWcStore((e) => e.setRuleJsonInputValue);
  const initValue = useWcStore((e) => e.initRuleJsonInputValue);

  useEffect(() => {
    initValue();
    return () => {
      useWcStore.setState({ isValidJson: true });
    };
  }, [initValue]);

  return (
    <div className="top-0 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
        aria-invalid={!isValid}
        className={cn(
          `focus-visible:border-input w-full rounded-xl border bg-transparent p-6 font-sans leading-6 focus-visible:ring-0`,
        )}
        placeholder="JSON 입력"
      />
      <div
        className={`text-sm ${isValid ? "text-primary" : "text-destructive"}`}
      >
        {isValid ? "유효한 JSON입니다." : "유효하지 않은 JSON입니다."}
      </div>
    </div>
  );
}
