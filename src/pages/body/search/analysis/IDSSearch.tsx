import WordsTrail from "@/components/ui/WordsTrail";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { Word } from "@/lib/wc/WordChain";
import { CornerDownRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function IDSSearch() {
  const [searchInputValue, engine] = useWC((e) => [
    e.searchInputValue,
    e.engine,
  ]);

  const [wordStack, setWordStack] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const [depth, setDepth] = useState<number>(1);
  const [maxStack, setMaxStack] = useState<undefined | Word[]>();
  const worker = useRef<Worker>(null!);

  useEffect(() => {
    if (!engine) {
      return;
    }

    if (worker.current) {
      worker.current.terminate();
    }
    setDepth(1);
    setWordStack([]);
    setMaxStack(undefined);
    setResult(undefined);

    worker.current = new Worker(
      new URL("../../../../lib/worker/analysisWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    worker.current.onmessage = ({ data }) => {
      if (data.action === "IDS:newDepth") {
        setDepth(data.data);
      } else if (data.action === "IDS:push") {
        setWordStack((wordStack) => [
          ...wordStack,
          engine!.wordMap
            .select(data.data[0], data.data[1])
            .filter((e) => !wordStack.includes(e))[0],
        ]);
      } else if (data.action === "IDS:pop") {
        setWordStack((wordStack) => wordStack.slice(0, wordStack.length - 1));
      } else if (data.action === "IDS:end") {
        const specifiedMaxStack: Word[] = [];

        for (const [head, tail] of data.data.maxStack) {
          specifiedMaxStack.push(
            engine!.wordMap
              .select(head, tail)
              .find((word) => !specifiedMaxStack.includes(word))!
          );
        }
        setMaxStack(specifiedMaxStack);
        setResult(data.data.win);
      }
    };

    worker.current.postMessage({
      action: "IDS:startAnalysis",
      data: {
        withStack: true,
        chanGraph: engine!.chanGraph,
        wordGraph: engine!.wordGraph,
        startChar: searchInputValue,
      },
    });

    return () => {
      worker.current.terminate();
    };
  }, [searchInputValue, engine]);

  return (
    <div className="flex flex-col items-start gap-4 mb-2 w-full px-2">
      <div className="flex items-center gap-1 text-sm">
        <div className="text-muted-foreground ">최대 깊이 : </div>
        <div>{depth}</div>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap gap-y-1 gap-x-0.5 items-center text-xs pb-4">
          <WordsTrail words={maxStack || wordStack} />
        </div>
        <div>
          {result !== undefined && (
            <div className="flex items-center gap-1 font-medium">
              <CornerDownRight className="w-4 h-4" />
              <div>
                <span className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline">
                  {searchInputValue}
                </span>
                <span className="font-normal"> : </span>
                <span
                  className={cn({
                    "text-win": result,
                    "text-los": !result,
                  })}
                >
                  {result ? "승리" : "패배"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

