import { shuffle } from "lodash";
import { choice } from "../utils";
import {
  getNextWords,
  getReachableNodes,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";
import {
  Char,
  objToInstance,
  WCDisplay,
  WCEngine,
  Word,
  WordType,
} from "../wc/WordChain";
let originalEngine: undefined | WCEngine = undefined;
export type payload = {
  action: "init" | "getComputerMove" | "stopAnalysis";
  data: unknown;
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
let analysisWorker: Worker | undefined = undefined;
const getComputerMove = ({
  isGuel,
  exceptWords,
  currChar,
  strength,
  calcTime,
  steal,
  debug,
}: {
  isGuel: boolean;
  exceptWords: string[];
  currChar: Char;
  strength: 0 | 1 | 2;
  steal: boolean;
  calcTime: number;
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
      if (analysisWorker) {
        analysisWorker.terminate();
      }
      analysisWorker = new Worker(
        new URL("./analysisWorker.ts", import.meta.url),
        {
          type: "module",
        }
      );
      let currIdx = 0;
      let timeout: undefined | NodeJS.Timeout;
      const onIdk = () => {
        analysisWorker!.terminate();
        if (debug) {
          self.postMessage({
            action: "debug",
            data: {
              messages: [
                {
                  type: "debug",
                  content: `${wordList[currIdx]} : 알 수 없음`,
                },
              ],
            },
          });
        }
        if (timeout) {
          clearTimeout(timeout);
        }
        postWord([wordList[currIdx]], exceptWords);
        analysisWorker!.terminate();
      };

      analysisWorker.onmessage = ({ data }) => {
        switch (data.action) {
          case "end":
            if (timeout) {
              clearTimeout(timeout);
            }
            if (!data.data.win) {
              if (exceptWords.length !== 0) {
                if (debug) {
                  self.postMessage({
                    action: "debug",
                    data: {
                      messages: [
                        {
                          type: "debug",
                          content: `${wordList[currIdx]} : 승리`,
                        },
                        {
                          type: "debug",
                          content: "승리 확정",
                        },
                      ],
                    },
                  });
                }

                postWord([wordList[currIdx]], exceptWords);
                analysisWorker!.terminate();
                return;
              } else {
                if (debug) {
                  self.postMessage({
                    action: "debug",
                    data: {
                      messages: [
                        {
                          type: "debug",
                          content: `${wordList[currIdx]} : 승리`,
                        },
                      ],
                    },
                  });
                }
              }
            } else {
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      {
                        type: "debug",
                        content: `${wordList[currIdx]} : 패배`,
                      },
                    ],
                  },
                });
              }
            }
            // 모든 게 패배일 때

            if (currIdx === wordList.length - 1) {
              if (exceptWords.length === 1 && steal) {
                if (debug) {
                  self.postMessage({
                    action: "debug",
                    data: {
                      messages: [
                        { type: "debug", content: `단어 뺏기` },
                        { type: "debug", content: `승리 확정` },
                      ],
                    },
                  });
                }
                postWord(exceptWords, exceptWords);
              } else {
                if (debug) {
                  self.postMessage({
                    action: "debug",
                    data: {
                      messages: [{ type: "debug", content: `패배 확정` }],
                    },
                  });
                }
                postWord(wordList, exceptWords);
              }

              return;
            }
            // 그렇지 않을 때
            else {
              currIdx++;
              analysisWorker!.postMessage({
                action: "startAnalysis",
                data: {
                  withStack: false,
                  chanGraph: engine!.chanGraph,
                  wordGraph: engine!.wordGraph,
                  startChar: wordList[currIdx].at(engine!.rule.tailIdx),
                  exceptWord: [
                    wordList[currIdx].at(engine!.rule.headIdx),
                    wordList[currIdx].at(engine!.rule.tailIdx),
                  ],
                },
              });
              timeout = setTimeout(() => {
                onIdk();
              }, 1000 * calcTime);
            }

            return;
        }
      };

      analysisWorker.postMessage({
        action: "startAnalysis",
        data: {
          isGuel: isGuel,
          withStack: false,
          chanGraph: engine!.chanGraph,
          wordGraph: engine!.wordGraph,
          startChar: wordList[0].at(engine!.rule.tailIdx),
          exceptWord: [
            wordList[0].at(engine!.rule.headIdx),
            wordList[0].at(engine!.rule.tailIdx),
          ],
        },
      });

      timeout = setTimeout(() => {
        onIdk();
      }, 1000 * calcTime);
    };
    if (currChar) {
      if (!(engine?.chanGraph.nodes[currChar].type! === "route")) {
        switch (engine?.chanGraph.nodes[currChar].type!) {
          case "wincir":
          case "win":
            if (debug) {
              self.postMessage({
                action: "debug",
                data: {
                  messages: [
                    { type: "debug", content: `${currChar} : 승리 음절` },
                    { type: "debug", content: `승리 확정` },
                  ],
                },
              });
            }
            postWord([WCDisplay.getWinWord(engine!, currChar)], exceptWords);
            return;

          case "los":
          case "loscir":
            if (exceptWords.length === 1 && steal) {
              // 1턴 째일 때 단어 뺏기
              if (debug) {
                self.postMessage({
                  action: "debug",
                  data: {
                    messages: [
                      {
                        type: "debug",
                        content: `${currChar} : 패배 음절`,
                      },
                      {
                        type: "debug",
                        content: `단어 뺏기`,
                      },
                      { type: "debug", content: "승리 확정" },
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
                      {
                        type: "debug",
                        content: `${currChar} : 패배 음절`,
                      },
                      {
                        type: "debug",
                        content: "패배 확정",
                      },
                    ],
                  },
                });
              }
              const losWord = WCDisplay.getLosWord(engine!, currChar);
              const lastWord = engine!.getNextWords(currChar)[0];
              if (losWord || lastWord) {
                postWord([losWord || lastWord], exceptWords);
              } else {
                postWord([], exceptWords);
              }

              return;
            }
        }
      } else {
        if (strength === 1) {
          if (debug) {
            self.postMessage({
              action: "debug",
              data: {
                messages: [
                  {
                    type: "debug",
                    content: "랜덤 루트",
                  },
                ],
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
              messages: [
                {
                  type: "debug",
                  content: "랜덤루트",
                },
              ],
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
    case "init":
      originalEngine = objToInstance(data as WCEngine);
      return;
    case "getComputerMove":
      getComputerMove(
        data as {
          isGuel: boolean;
          exceptWords: string[];
          currChar: Char;
          strength: 0 | 1 | 2;
          calcTime: number;
          steal: boolean;
          debug: boolean;
        }
      );
      return;
    case "stopAnalysis":
      if (analysisWorker) {
        analysisWorker.terminate();
      }
  }
};
