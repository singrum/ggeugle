import { CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cates, dicts } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import type { SelectedWordsOption } from "@/types/rule";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function Cate() {
  const cate = useWcStore(
    (e) => (e.localRule.wordRule.words.option as SelectedWordsOption).cate,
  );
  const dict = useWcStore(
    (e) => (e.localRule.wordRule.words.option as SelectedWordsOption).dict,
  );

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>범주</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        {cates.map((e) => (
          <Toggle
            variant="outline"
            key={e}
            pressed={cate[e] === 1}
            disabled={!dicts[dict].activeCate[e]}
            onPressedChange={(value: boolean) => {
              useWcStore.setState((state) => {
                (
                  state.localRule.wordRule.words.option as SelectedWordsOption
                ).cate[e] = Number(value) as 0 | 1;
              });
            }}
          >
            {/* <Check
              className={cn("stroke-muted-foreground stroke-3", {
                "stroke-primary": cate[e] === 1,
              })}
            /> */}
            {e}
          </Toggle>
        ))}
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
