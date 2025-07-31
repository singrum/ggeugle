import { CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { dicts, poses } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import type { SelectedWordsOption } from "@/types/rule";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function Pos() {
  const pos = useWcStore(
    (e) => (e.localRule.wordRule.words.option as SelectedWordsOption).pos,
  );
  const dict = useWcStore(
    (e) => (e.localRule.wordRule.words.option as SelectedWordsOption).dict,
  );

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>품사</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        {poses.map((e) => (
          <Toggle
            variant="outline"
            key={e}
            pressed={pos[e] === 1}
            disabled={!dicts[dict].activePos[e]}
            onPressedChange={(value: boolean) => {
              useWcStore.setState((state) => {
                (
                  state.localRule.wordRule.words.option as SelectedWordsOption
                ).pos[e] = Number(value) as 0 | 1;
              });
            }}
          >
            {/* <Check
              className={cn("stroke-muted-foreground stroke-3", {
                "stroke-primary": pos[e] === 1,
              })}
            /> */}

            {e}
          </Toggle>
        ))}
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
