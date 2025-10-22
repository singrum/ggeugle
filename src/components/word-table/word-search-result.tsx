import { useWcStore } from "@/stores/wc-store";
import type { WordsCard } from "@/types/search";
import { useEffect, useState } from "react";
import { Accordion } from "../ui/accordion";
import WordsCardComponent from "./words-card-component";

export default function WordSearchResult({ data }: { data: WordsCard[] }) {
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const view = useWcStore((e) => e.view);
  const defaultAllOpen = useWcStore((e) => e.defaultAllOpen);

  const defaultValue = !defaultAllOpen ? [`0`] : data.map((_, i) => `${i}`);

  const [openValues, setOpenValues] = useState<string[]>(defaultValue);

  useEffect(() => {
    const getDefaultValue = () =>
      !defaultAllOpen ? [`0`] : data.map((_, i) => `${i}`);
    setOpenValues(getDefaultValue());
  }, [data, defaultAllOpen]);

  return (
    <Accordion
      key={`${view}-${searchInputValue}`}
      type="multiple"
      className="space-y-2"
      defaultValue={defaultValue}
      onValueChange={setOpenValues}
      value={openValues}
    >
      {data.map((card, i) => (
        <WordsCardComponent
          key={`${searchInputValue}-${view}-${i}`}
          value={`${i}`}
          data={card}
        />
      ))}
    </Accordion>
  );
}
