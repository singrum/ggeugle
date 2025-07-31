import { useWcStore } from "@/stores/wc-store";
import { OutlineCard } from "../../../components/outline-card";
import Manner from "./postprocessing/manner";
import NextWordsLimit from "./postprocessing/next-words-limit";
import PostAddedWords from "./postprocessing/post-added-words";
import PostRemovedWords from "./postprocessing/post-removed-words";

export default function Postprocessing() {
  const type = useWcStore((e) => e.localRule.postprocessing.manner.type);
  return (
    <div className="space-y-4">
      <OutlineCard>
        <Manner />
        {type === 3 && <NextWordsLimit />}
      </OutlineCard>
      <OutlineCard>
        <PostAddedWords />
        <PostRemovedWords />
      </OutlineCard>
    </div>
  );
}
