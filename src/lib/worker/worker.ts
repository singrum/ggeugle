import { shuffle } from "lodash";
import { RuleForm } from "../store/useWC";
import { choice } from "../utils";
import {
  getNextWords,
  getReachableNodes,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";

import { getEngine } from "../wc/ruleUpdate";
import { Char, WCDisplay, WCEngine, Word, WordType } from "../wc/WordChain";

export type payload = {
  action: "getEngine" | "setWords" | "getComputerMove";
  data: unknown;
};
let originalEngine: undefined | WCEngine = undefined;

const getEngine_ = async (ruleForm: RuleForm) => {
  originalEngine = await getEngine(ruleForm);

  self.postMessage({
    action: "getEngine",
    data: originalEngine,
  });

  // new RouteEngine(originalEngine);
};

const setWords = (exceptWords: Word[]) => {
  const mainEngine =
    exceptWords.length === 0
      ? originalEngine
      : originalEngine?.copy(exceptWords);

  self.postMessage({
    action: "getEngine",
    data: mainEngine,
  });
};

const postWord = (nextWords: Word[], exceptWords: Word[]) => {
  const result = choice(nextWords!);
  let isLos = false;

  if (
    exceptWords.length !== 0 &&
    result &&
    originalEngine!
      .getNextWords(result.at(originalEngine!.rule.tailIdx))
      .filter((e) => !exceptWords.includes(e) && e !== result).length === 0
  ) {
    isLos = true;
  }
  self.postMessage({
    action: "getComputerMove",
    data: { word: result, isLos },
  });
};

const getComputerMove = ({
  exceptWords,
  currChar,
  strength,
  steal,
  debug,
}: {
  exceptWords: string[];
  currChar: Char;
  strength: 0 | 1 | 2;
  steal: boolean;
  debug: boolean;
}) => {
  if (strength === 0) {
    if (currChar) {
      const nextWords = originalEngine!
        .getNextWords(currChar)
        .filter((e) => !exceptWords.includes(e));
      if (exceptWords.length === 1 && steal) {
        nextWords.push(exceptWords[0]);
      }
      postWord(nextWords, exceptWords);
      return;
    } else {
      postWord(originalEngine!.words, exceptWords);
      return;
    }
  } else {
    const engine = originalEngine?.copy(exceptWords);
    const analysisStart = (wordList: Word[]) => {
      const nextRoutesInfo: { word: string; win?: string }[] = wordList.map(
        (word) => ({ word })
      );
      const analysisWorker = new Worker(
        new URL("./analysisWorker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      let timeout: undefined | NodeJS.Timeout;

      const analysisNext = (
        nextRoutesInfo: { word: Word; win?: string }[],
        win: string
      ) => {
        const endedWordIdx = nextRoutesInfo.findIndex(
          ({ win }) => win === undefined
        );

        if (endedWordIdx === -1) {
          if (exceptWords.length === 1 && steal) {
            if (debug) {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [`[Debug] 단어 뺏기`, `[Debug] 승리 확정`],
                },
              });
            }
            postWord(exceptWords, exceptWords);
          } else {
            if (debug) {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [`[Debug] 패배 확정`],
                },
              });
            }
            postWord(
              nextRoutesInfo.map((e) => e.word),
              exceptWords
            );
          }

          return;
        }
        nextRoutesInfo[endedWordIdx].win = win;

        if (
          (nextRoutesInfo[endedWordIdx].win === "true" &&
            exceptWords.length !== 0) ||
          nextRoutesInfo[endedWordIdx].win === "idk"
        ) {
          if (debug) {
            if (nextRoutesInfo[endedWordIdx].win === "true") {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [
                    `[Debug] ${nextRoutesInfo[endedWordIdx].word} : 승리`,
                    "[Debug] 승리 확정",
                  ],
                },
              });
            } else {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [
                    `[Debug] ${nextRoutesInfo[endedWordIdx].word} : 알 수 없음`,
                  ],
                },
              });
            }
          }

          if (timeout) {
            clearTimeout(timeout);
          }

          postWord([nextRoutesInfo[endedWordIdx].word], exceptWords);
          analysisWorker.terminate();
          return;
        } else {
          if (debug) {
            self.postMessage({
              action: "debug",
              data: {
                messages: [
                  `[Debug] ${nextRoutesInfo[endedWordIdx].word} : 패배`,
                ],
              },
            });
          }

          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            analysisWorker.terminate();
            analysisNext(nextRoutesInfo, "idk");
          }, 3000);
          if (endedWordIdx !== nextRoutesInfo.length - 1) {
            analysisWorker.postMessage({
              action: "startAnalysis",
              data: {
                withStack: false,
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
        }
      };

      analysisWorker.onmessage = ({ data }) => {
        switch (data.action) {
          case "end":
            analysisNext(nextRoutesInfo, data.data.win ? "false" : "true");
            return;
        }
      };

      analysisWorker.postMessage({
        action: "startAnalysis",
        data: {
          withStack: false,
          chanGraph: engine!.chanGraph,
          wordGraph: engine!.wordGraph,
          startChar: nextRoutesInfo[0].word.at(engine!.rule.tailIdx),
          exceptWord: [
            nextRoutesInfo[0].word.at(engine!.rule.headIdx),
            nextRoutesInfo[0].word.at(engine!.rule.tailIdx),
          ],
        },
      });

      timeout = setTimeout(() => {
        analysisWorker.terminate();
        analysisNext(nextRoutesInfo, "idk");
      }, 3000);
    };
    if (currChar) {
      if (!(engine?.chanGraph.nodes[currChar].type! === "route")) {
        switch (engine?.chanGraph.nodes[currChar].type!) {
          case "wincir":
          case "win":
            const head = engine!.chanGraph.nodes[currChar].solution as Char;
            const tail = engine!.wordGraph.nodes[head as string]
              .solution as Char;
            if (debug) {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [
                    `[Debug] ${currChar} : 승리 글자`,
                    "[Debug] 승리 확정",
                  ],
                },
              });
            }
            postWord(engine!.wordMap.select(head, tail), exceptWords);
            return;

          case "los":
            if (exceptWords.length === 1 && steal) {
              // 1턴 째일 때 단어 뺏기
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      `[Debug] ${currChar} : 패배 글자`,
                      `[Debug] 단어 뺏기`,
                      "[Debug] 승리 확정",
                    ],
                  },
                });
              }
              postWord(exceptWords, exceptWords);
              return;
            } else {
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      `[Debug] ${currChar} : 패배 글자`,
                      "[Debug] 패배 확정",
                    ],
                  },
                });
              }
              postWord(
                engine!
                  .getNextWords(currChar)
                  .filter(
                    (word) =>
                      WCDisplay.getWordType(engine!, word).type === "los"
                  ),
                exceptWords
              );
              return;
            }

          case "loscir":
            if (exceptWords.length === 1 && steal) {
              // 1턴 째일 때 단어 뺏기
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      `[Debug] ${currChar} : 조건부 패배 글자`,
                      `[Debug] 단어 뺏기`,
                      "[Debug] 승리 확정",
                    ],
                  },
                });
              }
              postWord(exceptWords, exceptWords);
              return;
            } else {
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      `[Debug] ${currChar} : 조건부 패배 글자`,
                      "[Debug] 패배 확정",
                    ],
                  },
                });
              }
              let nextWords = engine!
                .getNextWords(currChar)
                .filter(
                  (word) =>
                    WCDisplay.getWordType(engine!, word).type ===
                    "loscir_return"
                );

              if (nextWords.length === 0) {
                nextWords = engine!
                  .getNextWords(currChar)
                  .filter(
                    (word) =>
                      WCDisplay.getWordType(engine!, word).type === "loscir"
                  );
              }
              postWord(nextWords, exceptWords);
            }

            break;
        }
      } else {
        if (strength === 1) {
          if (debug) {
            self.postMessage({
              action: "debug",
              data: {
                messages: [`[Debug] 랜덤 루트`],
              },
            });
          }
          postWord(
            getNextWords(
              engine!.chanGraph,
              engine!.wordGraph,
              currChar
            ).flatMap(({ word }) => {
              const head = word[0];
              const tail = word[1];
              return engine!.wordMap.select(head, tail);
            }),
            exceptWords
          );
        } else if (strength === 2) {
          const reacheable = getReachableNodes(
            engine!.chanGraph,
            engine!.wordGraph,
            currChar
          );
          const rootChanGraph = engine!.chanGraph.getSubgraph(reacheable);
          const rootWordGraph = engine!.wordGraph.getSubgraph(reacheable);
          pruningWinLos(rootChanGraph, rootWordGraph);
          pruningWinLosCir(rootChanGraph, rootWordGraph);

          analysisStart(
            getNextWords(engine!.chanGraph, engine!.wordGraph, currChar, true)
              .sort((a, b) => {
                return a.moveNum! - b.moveNum!;
              })
              .map((e) => e.word)
              .map(([head, tail]) => engine!.wordMap.select(head, tail)[0])
          );
        }
      }
    } else {
      // 컴퓨터가 선공인 경우
      if (strength === 1) {
        if (debug) {
          self.postMessage({
            action: "debug",
            data: {
              messages: [`[Debug] 랜덤 루트`],
            },
          });
        }
        postWord(
          Object.keys(engine!.chanGraph.nodes).flatMap((char) =>
            engine!.chanGraph.nodes[char].type === "route"
              ? engine!
                  .getNextWords(char)
                  .filter(
                    (word) =>
                      WCDisplay.reduceWordtype(
                        WCDisplay.getWordType(engine!, word).type as WordType
                      ) === "route"
                  )
              : []
          ),
          exceptWords
        );
      } else if (strength === 2) {
        const routeChars = new Set([
          ...Object.keys(engine!.chanGraph.nodes),
          ...Object.keys(engine!.wordGraph.nodes),
        ]);
        engine!.chanGraph.getSubgraph(routeChars);
        engine!.wordGraph.getSubgraph(routeChars);

        analysisStart(
          shuffle(
            engine!.wordGraph
              .edges()
              .map(([head, tail]) => engine!.wordMap.select(head, tail)[0])
          )
        );
      }
    }
  }

  // 다음으로 올 단어가 없는지 체크(사용자가 패배했는지 체크)
};

self.onmessage = (event) => {
  const { action, data }: payload = event.data;

  switch (action) {
    case "getEngine":
      getEngine_(data as RuleForm);
      return;
    case "setWords":
      setWords(data as Word[]);
      return;
    case "getComputerMove":
      getComputerMove(
        data as {
          exceptWords: string[];
          currChar: Char;
          strength: 0 | 1 | 2;
          steal: boolean;
          debug: boolean;
        }
      );
      return;
  }
};
