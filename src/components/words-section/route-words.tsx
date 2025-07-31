import WordsList from "@/components/words-section/words-list";
import WordsListLabel from "@/components/words-section/words-list-label";
import WordsSection from "@/components/words-section/words-section";

export default function RouteWords({ data }: { data: string[] }) {
  return (
    <div>
      <WordsSection>
        <WordsListLabel>루트 단어</WordsListLabel>
        <WordsList words={data} variant={"route"} />
      </WordsSection>
    </div>
  );
}
