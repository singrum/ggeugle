import { useWcStore } from "@/stores/wc-store";
import type { WordsCard } from "@/types/search";
import { Accordion } from "../ui/accordion";
import WordsCardComponent from "./words-card-component";

export default function WordSearchResult({ data }: { data: WordsCard[] }) {
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const view = useWcStore((e) => e.view);
  const defaultAllOpen = useWcStore((e) => e.defaultAllOpen);

  return (
    <>
      <div className="">
        <Accordion
          key={`${view}-${searchInputValue}`}
          type="multiple"
          defaultValue={!defaultAllOpen ? [`0`] : data.map((_, i) => `${i}`)}
          className="space-y-2"
        >
          {data.map((card, i) => (
            <WordsCardComponent key={`${i}`} value={`${i}`} data={card} />
          ))}
        </Accordion>
      </div>
    </>
  );
}
