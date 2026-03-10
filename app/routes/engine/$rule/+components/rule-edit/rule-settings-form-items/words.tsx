import { Separator } from "~/components/ui/separator";
import { useRuleEditorStore } from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";

import { OutlineCard } from "../../outline-card";
import AddedWords from "./words/added-words";
import Cate from "./words/cate";
import Dict from "./words/dict";
import FileUpload from "./words/file-upload";
import Pos from "./words/pos";
import RegexFilter from "./words/regex-filter";
import RemovedWords from "./words/removed-words";

export default function Words() {
  const type = useRuleEditorStore(
    (e) => e.localRuleForm.content.wordRule.words.type,
  );

  return (
    <div className="space-y-4">
      <OutlineCard>
        <Dict />
        {type === "selected" ? (
          <>
            <Pos />
            <Cate />
          </>
        ) : (
          <FileUpload />
        )}
      </OutlineCard>
      <div className="px-4">
        <Separator />
      </div>
      <OutlineCard>
        <AddedWords />
        <RemovedWords />

        <RegexFilter />
      </OutlineCard>
    </div>
  );
}
