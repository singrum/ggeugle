import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { getNextWords } from "@/lib/wc/algorithms";
import { Word } from "@/lib/wc/wordChain";
import { josa } from "es-hangul";
import { ChevronRight } from "lucide-react";
import {
  Fragment,
  useEffect,
  useRef,
  useState
} from "react";
import { FaRegPlayCircle } from "react-icons/fa";
export default function Analysis() {
  const [
    searchInputValue,
    engine,
    setValue,
    setSearchInputValue,
    exceptWords,
    setExceptWords,
  ] = useWC((e) => [
    e.searchInputValue,
    e.engine,
    e.setValue,
    e.setSearchInputValue,
    e.exceptWords,
    e.setExceptWords,
  ]);
  const [isAutoExcept] = useCookieSettings((e) => [e.isAutoExcept]);

  const [wordStack, setWordStack] = useState<Word[]>([]);

  const [nextRoutesInfo, setNextRoutesInfo] = useState<
    { word: Word; win?: boolean }[] | undefined
  >();
  const worker = useRef<Worker>(null!);

  useEffect(() => {
    if (!worker.current || !nextRoutesInfo) {
      return;
    }

    worker.current.onmessage = ({ data }) => {
      switch (data.action) {
        case "stackChange":
          setWordStack((stack) =>
            stack.length > data.data.length
              ? stack.splice(0, stack.length - 1)
              : [
                  ...stack,
                  engine!.wordMap
                    .select(data.data.at(-1)[0], data.data.at(-1)[1])
                    .filter((e) => !stack.includes(e))[0],
                ]
          );
          return;

        case "end":
          const { win } = data.data;

          const endedWordIdx = nextRoutesInfo.findIndex(
            ({ word, win }) => win === undefined
          );
          setWordStack([]);
          setNextRoutesInfo((e) => {
            const result = [...e!];
            result[endedWordIdx].win = !win;
            return result;
          });
          if (endedWordIdx !== nextRoutesInfo.length - 1 && win) {
            worker.current.postMessage({
              action: "startAnalysis",
              data: {
                withStack: true,
                chanGraph: engine!.chanGraph,
                wordGraph: engine!.wordGraph,
                startChar: nextRoutesInfo[endedWordIdx + 1].word.at(
                  engine!.rule.tailIdx
                ),
                exceptWord: [
                  nextRoutesInfo[endedWordIdx + 1].word.at(
                    engine!.rule.headIdx
                  ),
                  nextRoutesInfo[endedWordIdx + 1].word.at(
                    engine!.rule.tailIdx
                  ),
                ],
              },
            });
          }
          return;
      }
    };
  }, [nextRoutesInfo, worker.current]);

  useEffect(() => {
    if (!engine) {
      return;
    }

    const nextRoutesInfo_ = getNextWords(
      engine!.chanGraph,
      engine!.wordGraph,
      searchInputValue,
      true
    )
      .sort((a, b) => {
        return a.moveNum! - b.moveNum!;
      })
      .map((e) => e.word)
      .map(([head, tail]) => ({
        word: engine!.wordMap.select(head, tail)[0],
      }));
    setNextRoutesInfo(nextRoutesInfo_);

    if (worker.current) {
      worker.current.terminate();
    }
    setWordStack([]);

    worker.current = new Worker(
      new URL("../../../lib/worker/analysisWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    worker.current.postMessage({
      action: "startAnalysis",
      data: {
        withStack: true,
        chanGraph: engine!.chanGraph,
        wordGraph: engine!.wordGraph,
        startChar: nextRoutesInfo_[0].word.at(engine!.rule.tailIdx),
        exceptWord: [
          nextRoutesInfo_[0].word.at(engine!.rule.headIdx),
          nextRoutesInfo_[0].word.at(engine!.rule.tailIdx),
        ],
      },
    });

    return () => {
      worker.current.terminate();
    };
  }, [searchInputValue, engine]);

  const firstUndefIdx =
    nextRoutesInfo &&
    nextRoutesInfo.findIndex(({ word, win }) => win === undefined);
  const firstWinIdx =
    nextRoutesInfo && nextRoutesInfo.findIndex(({ word, win }) => win);

  return (
    nextRoutesInfo && (
      <div className="flex flex-col items-start gap-1 mb-2">
        <Alert>
          <FaRegPlayCircle className="h-5 w-5" />
          <AlertTitle className="font-normal">
            <span className="underline">{searchInputValue}</span>에서 필승 전략
            탐색을 시작합니다.
          </AlertTitle>
          <AlertDescription>
            {nextRoutesInfo.length >= 2 ? (
              <>
                {nextRoutesInfo.map(({ word }, i) => (
                  <Fragment key={word}>
                    <span
                      className="underline cursor-pointer"
                      onClick={() => {
                        setValue(word.at(engine!.rule.tailIdx)!);
                        setSearchInputValue(word.at(engine!.rule.tailIdx)!);
                        if (isAutoExcept && !exceptWords.includes(word)) {
                          setExceptWords([...exceptWords, word]);
                        }
                      }}
                    >
                      {word}
                    </span>
                    {nextRoutesInfo.length - 1 !== i && <span>, </span>}
                  </Fragment>
                ))}
                <span> 중 하나가 승리하면 탐색을 종료합니다.</span>
              </>
            ) : (
              <>
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    setValue(nextRoutesInfo[0].word.at(engine!.rule.tailIdx)!);
                    setSearchInputValue(
                      nextRoutesInfo[0].word.at(engine!.rule.tailIdx)!
                    );
                    if (
                      isAutoExcept &&
                      !exceptWords.includes(nextRoutesInfo[0].word)
                    ) {
                      setExceptWords([...exceptWords, nextRoutesInfo[0].word]);
                    }
                  }}
                >
                  {nextRoutesInfo[0].word}
                </span>
                {josa(nextRoutesInfo[0].word, "이/가").at(-1)} 승리하면 탐색을
                종료합니다.
              </>
            )}
          </AlertDescription>
        </Alert>

        {nextRoutesInfo
          .slice(
            0,
            firstUndefIdx === -1 ? nextRoutesInfo.length : firstUndefIdx
          )
          .map(({ word, win }, i) => (
            <div key={word}>
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  setValue(word.at(engine!.rule.tailIdx)!);
                  setSearchInputValue(word.at(engine!.rule.tailIdx)!);
                  if (isAutoExcept && !exceptWords.includes(word)) {
                    setExceptWords([...exceptWords, word]);
                  }
                }}
              >
                {word}
              </span>
              {josa(word, "은/는").at(-1)}{" "}
              <span className={cn({ "text-win": win, "text-los": !win })}>
                {win ? "승리" : "패배"}
              </span>
              합니다.
            </div>
          ))}
        {firstWinIdx === -1 && firstUndefIdx !== -1 ? (
          <>
            <div>
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  setValue(
                    nextRoutesInfo[firstUndefIdx!].word.at(
                      engine!.rule.tailIdx
                    )!
                  );
                  setSearchInputValue(
                    nextRoutesInfo[firstUndefIdx!].word.at(
                      engine!.rule.tailIdx
                    )!
                  );
                  if (
                    isAutoExcept &&
                    !exceptWords.includes(nextRoutesInfo[firstUndefIdx!].word)
                  ) {
                    setExceptWords([
                      ...exceptWords,
                      nextRoutesInfo[firstUndefIdx!].word,
                    ]);
                  }
                }}
              >
                {nextRoutesInfo[firstUndefIdx!].word}
              </span>{" "}
              탐색 중...
            </div>

            <div className="flex flex-wrap gap-0 items-center text-xs">
              {[nextRoutesInfo[firstUndefIdx!].word, ...wordStack].map(
                (e, i) => (
                  <Fragment key={i}>
                    <div>{e}</div>
                    {i !== wordStack.length && (
                      <ChevronRight
                        className="text-muted-foreground w-4"
                        strokeWidth={1}
                      />
                    )}
                  </Fragment>
                )
              )}
            </div>
          </>
        ) : (
          <div>
            따라서 <span className="underline">{searchInputValue}</span>는{" "}
            <span
              className={cn({
                "text-win": firstWinIdx !== -1,
                "text-los": firstWinIdx === -1,
              })}
            >
              {firstWinIdx !== -1 ? "승리" : "패배"}
            </span>
            합니다.
          </div>
        )}
      </div>
    )
  );
}
