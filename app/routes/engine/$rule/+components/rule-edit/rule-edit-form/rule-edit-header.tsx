import { Input } from "~/components/ui/input";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "../rule-editor-store-provider";
import { RuleEditMenu } from "./rule-edit-menu";

export default function RuleEditHeader() {
  const title = useRuleEditorStore(
    (state) => state.localRuleForm.metadata.title,
  );
  const storeApi = useRuleEditorStoreApi();
  return (
    <div className=" pb-0 border-b flex flex-col ">
      <div className="p-6 ">
        <Input
          className="text-xl! font-semibold w-fit bg-background -my-2 -mx-3 border"
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
