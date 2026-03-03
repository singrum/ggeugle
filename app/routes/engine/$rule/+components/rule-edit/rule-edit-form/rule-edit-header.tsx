import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { colorMap, colors } from "~/constants/color";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "../rule-editor-store-provider";
import { RuleEditMenu } from "./rule-edit-menu";
export default function RuleEditHeader() {
  const title = useRuleEditorStore(
    (state) => state.localRuleForm.metadata.title,
  );
  const color = useRuleEditorStore(
    (state) => state.localRuleForm.metadata.color,
  );
  const storeApi = useRuleEditorStoreApi();
  return (
    <div className=" pb-0 border-b flex flex-col">
      <div className="p-6 flex items-center gap-2 pr-16">
        <Select
          value={color}
          onValueChange={(value) =>
            storeApi.setState((state) => {
              state.localRuleForm.metadata.color = value;
            })
          }
        >
          <SelectTrigger
            size="sm"
            className="aspect-square rounded-full border p-0 [&_svg]:hidden"
            style={{ backgroundColor: colorMap[color] }}
          />
          <SelectContent>
            <SelectGroup>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  <div
                    className="size-4 rounded-full mr-2"
                    style={{ backgroundColor: colorMap[color] }}
                  />
                  {color}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="text-xl! font-semibold bg-background -my-2  border flex-1"
          value={title}
          onChange={(e) =>
            storeApi.setState((state) => {
              state.localRuleForm.metadata.title = e.target.value;
            })
          }
        />
      </div>
      <RuleEditMenu />
    </div>
  );
}
