import { Separator } from "~/components/ui/separator";
import { useRuleEditorStore } from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import { OutlineCard } from "../../../routes/engine/$rule/+components/outline-card";
import Manner from "./postprocessing/manner";
import NextWordsLimit from "./postprocessing/next-words-limit";
import PostAddedWords from "./postprocessing/post-added-words";
import PostRemovedWords from "./postprocessing/post-removed-words";

export default function Postprocessing() {
  const type = useRuleEditorStore(
    (e) => e.localRuleForm.postprocessing.manner.type,
  );
  return (
    <div className="space-y-4">
      <OutlineCard>
        <Manner />
        {type === 3 && <NextWordsLimit />}
      </OutlineCard>
      <div className="px-4">
        <Separator />
      </div>
      <OutlineCard>
        <PostAddedWords />
        <PostRemovedWords />
      </OutlineCard>
    </div>
  );
}
