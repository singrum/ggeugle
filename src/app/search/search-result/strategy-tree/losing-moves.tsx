import { useTreeStore } from "@/stores/tree-store";
import WinloseIndicator from "./winlose-indicator";
import WordButton from "./word-button";
import WordList from "./word-list";

export default function LosingMoves({
  data,
}: {
  data: {
    words: string[][];
    selectedIndex: number;
    depth: number;
  };
}) {
  const selectIndex = useTreeStore((e) => e.selectIndex);
  return (
    <WordList>
      <WinloseIndicator isWin={false} />
      {data.words
        .map((word, index) =>
          word.map((w) => (
            <WordButton
              active={index === data.selectedIndex}
              onClick={() => selectIndex(data.depth, index)}
              key={w}
            >
              {w}
            </WordButton>
          )),
        )
        .flat()}
    </WordList>
  );
}
