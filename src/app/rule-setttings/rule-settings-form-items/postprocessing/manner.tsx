import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { manners } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";
export default function Manner() {
  const manner = useWcStore((e) => e.localRule.postprocessing.manner.type);

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>한방단어 제거</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent>
        <Select
          value={`${manner}`}
          onValueChange={(e: string) => {
            useWcStore.setState((state) => {
              state.localRule.postprocessing.manner.type = Number(e) as
                | 0
                | 1
                | 2
                | 3;
              if (Number(e) === 3) {
                state.localRule.postprocessing.manner.nextWordsLimit = 0;
              }
            });
            // selected
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {manners.map((e, i) => (
              <SelectItem key={i} value={`${i}`}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
