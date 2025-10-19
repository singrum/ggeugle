import { useWcStore } from "@/stores/wc-store";
import type { WordsCard } from "@/types/search";
import { useState } from "react";
import { Accordion } from "../ui/accordion";
import WordsCardComponent from "./words-card-component";

export default function WordSearchResult({ data }: { data: WordsCard[] }) {
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const view = useWcStore((e) => e.view);
  const defaultAllOpen = useWcStore((e) => e.defaultAllOpen);
  const defaultValue = !defaultAllOpen ? [`0`] : data.map((_, i) => `${i}`);
  const [openValues, setOpenValues] = useState<string[]>(defaultValue);

  return (
    <Accordion
      key={`${view}-${searchInputValue}`}
      type="multiple"
      defaultValue={defaultValue}
      className="space-y-2"
      onValueChange={setOpenValues}
    >
      {data.map((card, i) => (
        <WordsCardComponent
          key={`${i}`}
          value={`${i}`}
          data={card}
          open={openValues.includes(`${i}`)}
        />
      ))}
    </Accordion>
  );
}
