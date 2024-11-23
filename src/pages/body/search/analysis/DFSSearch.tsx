import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { getNextWords } from "@/lib/wc/algorithms";
import { precedenceMap } from "@/lib/wc/analysisPrecedence";
import { Word } from "@/lib/wc/WordChain";
import { josa } from "es-hangul";
import { ChevronRight, CornerDownRight, Play } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

export default function DFSSearch() {
  const [
    isGuel,
    searchInputValue,
    engine,
    setValue,
    setSearchInputValue,
    exceptWords,
    setExceptWords,
  ] = useWC((e) => [
    e.isGuel,
    e.searchInputValue,
    e.engine,
    e.setValue,
    e.setSearchInputValue,
    e.exceptWords,
    e.setExceptWords,
  ]);

  const [wordStack, setWordStack] = useState<Word[]>([]);
  const [nextRoutesInfo, setNextRoutesInfo] = useState<
    { word: Word; win?: boolean; maxStack?: Word[] }[] | undefined
  >();
  const [isGuelPrecedence, setIsGuelPrecedence] = useState<boolean>(false);
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
                    .filter(
                      (e) => !stack.includes(e) && !exceptWords.includes(e)
                    )[0],
                ]
          );
          return;

        case "end":
          const { win, maxStack } = data.data;

          const endedWordIdx = nextRoutesInfo.findIndex(
            ({ win }) => win === undefined
          );
          setWordStack([]);
          setNextRoutesInfo((e) => {
            const result = [...e!];

            result[endedWordIdx].win = !win;

            const specifiedMaxStack: Word[] = [];

            for (const [head, tail] of maxStack) {
              specifiedMaxStack.push(
                engine!.wordMap
                  .select(head, tail)
                  .find((word) => !specifiedMaxStack.includes(word))!
              );
            }

            result[endedWordIdx].maxStack = specifiedMaxStack;

            return result;
          });

          if (endedWordIdx !== nextRoutesInfo.length - 1 && win) {
            worker.current.postMessage({
              action: "startAnalysis",
              data: {
                isGuel: isGuelPrecedence,
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
        let a_key, b_key;
        if (isGuelPrecedence && precedenceMap[a.word[0]]?.[a.word[1]]) {
          a_key = -precedenceMap[a.word[0]][a.word[1]];
        } else {
          a_key = a.moveNum;
        }
        if (isGuelPrecedence && precedenceMap[b.word[0]]?.[b.word[1]]) {
          b_key = -precedenceMap[b.word[0]][b.word[1]];
        } else {
          b_key = b.moveNum;
        }

        return a_key! - b_key!;
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
      new URL("../../../../lib/worker/analysisWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    worker.current.postMessage({
      action: "startAnalysis",
      data: {
        isGuel: isGuelPrecedence,
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
  }, [searchInputValue, engine, isGuelPrecedence]);

  const firstUndefIdx =
    nextRoutesInfo && nextRoutesInfo.findIndex(({ win }) => win === undefined);
  const firstWinIdx =
    nextRoutesInfo && nextRoutesInfo.findIndex(({ win }) => win);

  return (
    nextRoutesInfo && (
      <div className="flex flex-col items-start gap-4 mb-2 w-full">
        <Alert>
          <Play className="h-5 w-5" strokeWidth={1.5} />
          <AlertTitle className="font-normal">
            <span className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline font-medium">
              {searchInputValue}
            </span>
            에서 필승 전략을 탐색합니다.
          </AlertTitle>
          <AlertDescription>
            {nextRoutesInfo.length >= 2 ? (
              <>
                {nextRoutesInfo.map(({ word }, i) => (
                  <Fragment key={word}>
                    <span
                      className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline font-medium"
                      onClick={() => {
                        setValue(word.at(engine!.rule.tailIdx)!);
                        setSearchInputValue(word.at(engine!.rule.tailIdx)!);
                        if (!exceptWords.includes(word)) {
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
                  className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline font-medium"
                  onClick={() => {
                    setValue(nextRoutesInfo[0].word.at(engine!.rule.tailIdx)!);
                    setSearchInputValue(
                      nextRoutesInfo[0].word.at(engine!.rule.tailIdx)!
                    );
                    if (!exceptWords.includes(nextRoutesInfo[0].word)) {
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
        {isGuel && (
          <div className="flex justify-start w-full pl-2">
            <div className="space-x-2 flex">
              <Checkbox
                id="prec"
                onCheckedChange={(e) => setIsGuelPrecedence(e as boolean)}
              />
              <Label htmlFor="prec">우선 순위 변경</Label>
            </div>
          </div>
        )}

        <div className="w-full">
          {nextRoutesInfo
            .slice(
              0,
              firstUndefIdx === -1 ? nextRoutesInfo.length : firstUndefIdx
            )
            .map(({ word, win, maxStack }) => (
              <div key={word} className="w-full">
                <div key={word} className="w-full px-2">
                  <div className="w-full mb-2 font-medium">
                    <span
                      className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline"
                      onClick={() => {
                        setValue(word.at(engine!.rule.tailIdx)!);
                        setSearchInputValue(word.at(engine!.rule.tailIdx)!);
                        if (!exceptWords.includes(word)) {
                          setExceptWords([...exceptWords, word]);
                        }
                      }}
                    >
                      {word}
                    </span>
                    <span className="font-normal"> : </span>
                    <span className={cn({ "text-win": win, "text-los": !win })}>
                      {win ? "승리" : "패배"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-y-1 gap-x-0.5 items-center text-xs">
                    {[word, ...maxStack!].map((e, i) => (
                      <Fragment key={i}>
                        <div className="flex items-center">{e}</div>
                        {i !== maxStack!.length && (
                          <ChevronRight
                            className="text-muted-foreground w-3 h-3"
                            strokeWidth={1}
                          />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          {firstWinIdx === -1 && firstUndefIdx !== -1 ? (
            <div className="w-full px-2">
              <div className="mb-2 font-medium">
                <span
                  className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline"
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
                <span className="font-normal">: </span>
                <span className="font-normal">탐색 중...</span>
              </div>

              <div className="flex flex-wrap gap-y-1 gap-x-0.5 items-center text-xs">
                {[nextRoutesInfo[firstUndefIdx!].word, ...wordStack].map(
                  (e, i) => (
                    <Fragment key={i}>
                      <div className="flex items-center">{e}</div>
                      {i !== wordStack.length && (
                        <ChevronRight
                          className="text-muted-foreground w-3 h-3"
                          strokeWidth={1}
                        />
                      )}
                    </Fragment>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="mx-2 flex items-center gap-1 font-medium">
              <CornerDownRight className="w-4 h-4" />
              <div>
                <span className="underline underline-offset-2 decoration-dotted cursor-pointer hover:no-underline">
                  {searchInputValue}
                </span>
                <span className="font-normal"> : </span>
                <span
                  className={cn({
                    "text-win": firstWinIdx !== -1,
                    "text-los": firstWinIdx === -1,
                  })}
                >
                  {firstWinIdx !== -1 ? "승리" : "패배"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
