import { useWcStore } from "@/stores/wc-store";

import { OutlineCard } from "../../../components/outline-card";
import AddedWords from "./words/added-words";
import Cate from "./words/cate";
import Dict from "./words/dict";
import FileUpload from "./words/file-upload";
import Pos from "./words/pos";
import RegexFilter from "./words/regex-filter";
import RemovedWords from "./words/removed-words";

export default function Words() {
  const type = useWcStore((e) => e.localRule.wordRule.words.type);

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
      <OutlineCard>
        <AddedWords />
        <RemovedWords />

        <RegexFilter />
      </OutlineCard>
    </div>
  );
}
