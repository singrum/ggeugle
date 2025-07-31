import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";
import RegexExamples from "./regex-examples";

export default function RegexFilter() {
  const value = useWcStore((e) => e.localRule.wordRule.regexFilter);
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>Regex 필터</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Input
          value={value}
          onChange={(e) =>
            useWcStore.setState((state) => {
              state.localRule.wordRule.regexFilter = e.target.value;
            })
          }
        />
      </OutlineCardContent>
      <RegexExamples />
    </OutlineCardSection>
  );
}
