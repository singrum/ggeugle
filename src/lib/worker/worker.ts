import { RuleForm } from "../store/useWC";
import { choice } from "../utils";
import {
  getNextWords,
  getReachableNodes,
  isWin,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";

import { getEngine } from "../wc/ruleUpdate";
import { Char, WCDisplay, WCEngine, Word, WordType } from "../wc/wordChain";

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
  const mainEngine = originalEngine?.copy(exceptWords);

  self.postMessage({
    action: "getEngine",
    data: mainEngine,
  });
};

const getComputerMove = ({
  exceptWords,
  currChar,
  strength,
}: {
  exceptWords: string[];
  currChar: Char;
  strength: 0 | 1 | 2;
}) => {
  let nextWords: Word[];
  if (strength === 0) {
    if (currChar) {
      nextWords = originalEngine!
        .getNextWords(currChar)
        .filter((e) => !exceptWords.includes(e));
      if (exceptWords.length === 1) {
        nextWords.push(exceptWords[0]);
      }
    } else {
      nextWords = originalEngine!.words;
    }
  } else {
    const engine = originalEngine?.copy(exceptWords);
    if (currChar) {
      switch (engine?.chanGraph.nodes[currChar].type!) {
        case "wincir":
        case "win":
          const head = engine!.chanGraph.nodes[currChar].solution as Char;
          const tail = engine!.wordGraph.nodes[head as string].solution as Char;

          nextWords = engine!.wordMap.select(head, tail);

          // engine!.words.filter(
          //   (e) =>
          //     e.at(engine!.rule.headIdx) === head &&
          //     e.at(engine!.rule.tailIdx) === tail
          // );

          break;
        case "los":
          if (exceptWords.length === 1) {
            // 1턴 째일 때 단어 뺏기
            nextWords = exceptWords;
          } else {
            nextWords = engine!
              .getNextWords(currChar)
              .filter(
                (word) => WCDisplay.getWordType(engine!, word).type === "los"
              );
          }
          break;
        case "loscir":
          if (exceptWords.length === 1) {
            // 1턴 째일 때 단어 뺏기
            nextWords = exceptWords;
          } else {
            nextWords = engine!
              .getNextWords(currChar)
              .filter(
                (word) =>
                  WCDisplay.getWordType(engine!, word).type === "loscir_return"
              );
            if (nextWords.length === 0) {
              nextWords = engine!
                .getNextWords(currChar)
                .filter(
                  (word) =>
                    WCDisplay.getWordType(engine!, word).type === "loscir"
                );
            }
          }

          break;

        case "route":
          if (strength === 1) {
            nextWords = getNextWords(
              engine!.chanGraph,
              engine!.wordGraph,
              currChar
            ).flatMap(({ word }) => {
              const head = word[0];
              const tail = word[1];
              return engine!.wordMap.select(head, tail);
              // return engine!.words.filter(
              //   (word) =>
              //     word.at(engine!.rule.headIdx)! === head &&
              //     word.at(engine!.rule.tailIdx)! === tail
              // );
            });
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

            const winWord = isWin(rootChanGraph, rootWordGraph, currChar);

            if (winWord) {
              console.log("승리 확정");
              nextWords = engine!.wordMap.select(
                winWord[0] as Char,
                winWord[1] as Char
              );
              // nextWords = engine!.words.filter(
              //   (e) =>
              //     e.at(engine!.rule.headIdx) === winWord[0] &&
              //     e.at(engine!.rule.tailIdx) === winWord[1] &&
              //     !exceptWords.includes(e)
              // );
            } else {
              console.log("패배 확정");
              const word = choice(
                getNextWords(
                  engine!.chanGraph,
                  engine!.wordGraph,
                  currChar
                ).map(({ word }) => word)
              );
              nextWords = engine!.wordMap.select(
                word[0] as Char,
                word[1] as Char
              );
              // nextWords = engine!.words.filter(
              //   (e) =>
              //     e.at(engine!.rule.headIdx) === word[0] &&
              //     e.at(engine!.rule.tailIdx) === word[1] &&
              //     !exceptWords.includes(e)
              // );
              // console.log(nextWords);
            }
          }
          break;
      }
    } else {
      // 컴퓨터가 선공인 경우
      if (strength === 1) {
        nextWords = Object.keys(engine!.chanGraph.nodes).flatMap((char) =>
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
        );
      } else if (strength === 2) {
      }
    }
  }

  // 다음으로 올 단어가 없는지 체크(사용자가 패배했는지 체크)
  const result = choice(nextWords!);
  let isLos = false;

  if (
    result &&
    originalEngine!
      .getNextWords(result.at(originalEngine!.rule.tailIdx))
      .filter((e) => !exceptWords.includes(e)).length === 0
  ) {
    isLos = true;
  }

  self.postMessage({
    action: "getComputerMove",
    data: { word: result, isLos },
  });
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
        data as { exceptWords: string[]; currChar: Char; strength: 0 | 1 | 2 }
      );
      return;
  }
};
