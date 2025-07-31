import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function NextWordsLimit() {
  const nextWordsLimit = useWcStore(
    (e) => e.localRule.postprocessing.manner.nextWordsLimit,
  );

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>다음 단어 최소 개수</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={nextWordsLimit}
            className="w-[100px]"
            onChange={(e) =>
              useWcStore.setState((state) => {
                state.localRule.postprocessing.manner.nextWordsLimit = Number(
                  e.target.value,
                );
              })
            }
          />
          개
        </div>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
