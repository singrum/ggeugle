import WordsList from "@/components/words-section/words-list";
import WordsListLabel from "@/components/words-section/words-list-label";
import WordsSection from "@/components/words-section/words-section";

export default function RemovedWords({ data }: { data: string[] }) {
  return (
    <div>
      <WordsSection>
        <WordsListLabel>돌림 단어</WordsListLabel>
        <WordsList words={data} variant={"removed"} />
      </WordsSection>
    </div>
  );
}
