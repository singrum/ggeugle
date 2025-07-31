import WordsList from "@/components/words-section/words-list";
import WordsListLabel from "@/components/words-section/words-list-label";
import WordsSection from "@/components/words-section/words-section";
import type { WordVariant } from "@/types/search";

export default function WinloseWords({
  data,
  depth,
  wordType,
}: {
  data: string[];
  depth: number;
  wordType: WordVariant;
}) {
  return (
    <div>
      <WordsSection>
        <WordsListLabel>
          {depth + 1} 수 이내 {wordType === "win" ? "승리" : "패배"}
        </WordsListLabel>
        <WordsList words={data} variant={wordType} />
      </WordsSection>
    </div>
  );
}
