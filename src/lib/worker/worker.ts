import { RuleForm } from "../store/useWC";
import { choice } from "../utils";

import { getEngine } from "../wc/ruleUpdate";
import {
  Char,
  RouteAnalyzer,
  WCDisplay,
  WCEngine,
  Word,
  WordType,
} from "../wc/wordChain";

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
      switch (engine?.charInfo[currChar].type!) {
        case "wincir":
        case "win":
          nextWords = engine!
            .getNextWords(currChar)
            .filter(
              (word) =>
                WCDisplay.reduceWordtype(
                  WCDisplay.getWordType(engine!, word).type as WordType
                ) === "win"
            );

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
            if (!nextWords) {
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
            nextWords = engine!
              .getNextWords(currChar)
              .filter(
                (word) =>
                  WCDisplay.reduceWordtype(
                    WCDisplay.getWordType(engine!, word).type as WordType
                  ) === "route"
              );
          } else if (strength === 2) {

            new RouteAnalyzer(engine!, currChar)
          }
          break;
      }
    } else {
      // 컴퓨터가 선공인 경우
      if (strength === 1) {
        nextWords = Object.keys(engine!.charInfo).flatMap((char) =>
          engine!.charInfo[char].type === "route"
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
