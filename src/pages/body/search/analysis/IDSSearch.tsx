import { useWC } from "@/lib/store/useWC";
import { ChevronRight } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

export default function IDSSearch() {
  const [searchInputValue, engine] = useWC((e) => [
    e.searchInputValue,
    e.engine,
  ]);

  const [wordStack, setWordStack] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const [depth, setDepth] = useState<number>(1);
  const worker = useRef<Worker>(null!);

  useEffect(() => {
    if (!engine) {
      return;
    }

    if (worker.current) {
      worker.current.terminate();
    }
    setWordStack([]);
    setResult(undefined);

    worker.current = new Worker(
      new URL("../../../../lib/worker/analysisWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    worker.current.onmessage = ({ data }) => {
      if (data.action === "IDS:setNextRoutes") {
        // const info_: Record<Char, Record<Char, {}>> = {};
        // for (const [head, tail] of data) {
        //   if (info_[head]) {
        //     info_[head] = {};
        //   }
        //   if (info_[head][tail]) {
        //     info_[head][tail] = {
        //       state: undefined,
        //       wordStack: [engine!.wordMap.select(head, tail)],
        //     };
        //   }
        // }
        // setInfo(
        //   arrayToKeyMap(
        //     data.data.map((e: Char[]) => engine!.wordMap.select(e[0], e[1])[0]),
        //     () => ({
        //       state: undefined,
        //       wordStack: [],
        //     })
        //   )
        // );
      } else if (data.action === "IDS:newDepth") {
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
    <div className="flex flex-col items-start gap-4 mb-2 w-full">
      <div>{depth}</div>
      <div className="w-full">
        <div className="flex flex-wrap gap-y-1 gap-x-0.5 items-center text-xs">
          {wordStack.map((e, i) => (
            <Fragment key={i}>
              <div className="flex items-center">{e}</div>
              {i !== wordStack.length && (
                <ChevronRight
                  className="text-muted-foreground w-3 h-3"
                  strokeWidth={1}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div>
        {result !== undefined && <div>{result ? "승리" : "패배"}</div>}{" "}
      </div>
    </div>
  );
}
