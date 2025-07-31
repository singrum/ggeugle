import type { WordVariant } from "@/types/search";
import { WordButton } from "./word-button";

export default function WordsList({
  words,
  variant,
}: {
  words: string[];
  variant: WordVariant;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {words.map((word) => (
        <WordButton variant={variant} key={word}>
          {word}
        </WordButton>
      ))}
    </div>
  );
}
