import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function WordStack({
  words,
  clickable,
}: {
  words: string[];
  clickable?: boolean;
}) {
  const addExceptedWords = useWcStore((e) => e.addExceptedWords);
  const search = useWcStore((e) => e.search);
  const solver = useWcStore((e) => e.solver);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-x-1">
      {words.map((word, i) => (
        <motion.div
          key={word + (i === 0 ? "-0" : "")}
          className="flex items-center gap-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {clickable ? (
            <Button
              variant="link"
              className={cn(`text-foreground h-auto px-0 py-1 font-normal`, {
                underline: hoveredIndex !== null && i <= hoveredIndex,
              })}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                addExceptedWords(words.slice(0, i + 1));
                search(word.at(solver!.tailIdx)!);
              }}
            >
              <div className="text-xs">{word}</div>
            </Button>
          ) : (
            <div className="h-auto px-0 py-1">
              <div className="text-xs">{word}</div>
            </div>
          )}

          {i !== words.length - 1 && (
            <ChevronRight className="stroke-muted-foreground size-3" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
