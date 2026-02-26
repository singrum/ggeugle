import { useEffect } from "react";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";

export default function Json() {
  const value = useRuleEditorStore((e) => e.ruleJsonInputValue);
  const isValid = useRuleEditorStore((e) => e.isValidJson);
  const setValue = useRuleEditorStore((e) => e.setRuleJsonInputValue);
  const initValue = useRuleEditorStore((e) => e.initRuleJsonInputValue);
  const storeApi = useRuleEditorStoreApi();
  useEffect(() => {
    initValue();
    return () => {
      storeApi.setState({ isValidJson: true });
    };
  }, [initValue]);

  return (
    <div className="top-0 space-y-2 p-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
        aria-invalid={!isValid}
        className={cn(
          `focus-visible:border-input w-full rounded-xl border bg-accent p-6 font-sans leading-6 focus-visible:ring-0`,
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
