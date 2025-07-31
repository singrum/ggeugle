import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function HeadIndex() {
  const idx = useWcStore((e) => e.localRule.wordConnectionRule.rawHeadIdx);
  const dir = useWcStore((e) => e.localRule.wordConnectionRule.headDir);
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>첫 글자</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-row items-center gap-4">
        <Select
          value={`${dir}`}
          onValueChange={(e: string) => {
            const num = Number(e);
            useWcStore.setState((state) => {
              state.localRule.wordConnectionRule.headDir = num as 0 | 1;
            });
          }}
        >
          <SelectTrigger className="w-full max-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[0, 1].map((e) => (
              <SelectItem key={e} value={`${e}`}>
                {e === 0 ? "앞에서부터" : "뒤에서부터"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          className="w-full max-w-[100px]"
          value={idx}
          onChange={(e) =>
            useWcStore.setState((state) => {
              state.localRule.wordConnectionRule.rawHeadIdx = Number(
                e.target.value,
              );
            })
          }
        />
        <div className="whitespace-nowrap">번째 글자</div>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
