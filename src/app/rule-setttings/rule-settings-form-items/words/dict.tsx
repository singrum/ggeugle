import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dicts } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import { cloneDeep } from "lodash";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";
export default function Dict() {
  const words = useWcStore((e) => e.localRule.wordRule.words);
  const value = words.type === "manual" ? dicts.length : words.option.dict;

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>사전</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent>
        <Select
          value={`${value}`}
          onValueChange={(e: string) => {
            const num = Number(e);
            if (num < dicts.length) {
              useWcStore.setState((state) => {
                state.localRule.wordRule.words = {
                  type: "selected",
                  option: {
                    dict: num,
                    pos: cloneDeep(dicts[num].defaultPos),
                    cate: cloneDeep(dicts[num].defaultCate),
                  },
                };
              });
              // selected
            } else {
              // manual
              useWcStore.setState((state) => {
                state.localRule.wordRule.words = {
                  type: "manual",
                  option: { content: "" },
                };
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dicts.map(({ title }, i) => (
              <SelectItem key={i} value={`${i}`}>
                {title}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value={`${dicts.length}`}>직접 입력</SelectItem>
          </SelectContent>
        </Select>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
