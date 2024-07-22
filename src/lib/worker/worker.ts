import { RuleForm } from "../store/useWC";

import { getEngine } from "../wc/ruleUpdate";
import { Char, WCDisplay, WCEngine, Word } from "../wc/wordChain";

export type payload = {
  action: "getEngine" | "setWords" | "getGameWord";
  data: unknown;
};
let originalEngine: undefined | WCEngine = undefined;

const getEngine_ = async (ruleForm: RuleForm) => {
  originalEngine = await getEngine(ruleForm);

  const { rule, charInfo, words, SCC } = originalEngine;

  self.postMessage({
    action: "getEngine",
    data: { rule, charInfo, words, SCC },
  });
};

const setWords = (exceptWords: Word[]) => {
  const mainEngine = originalEngine?.copy(exceptWords);

  const { rule, charInfo, words, SCC } = mainEngine!;
  self.postMessage({
    action: "getEngine",
    data: { rule, charInfo, words, SCC },
  });
};

const getGameWord = ({
  exceptWords,
  currChar,
  strength,
}: {
  exceptWords: string[];
  currChar: Char;
  strength: 0 | 1 | 2;
}) => {
  const engine = originalEngine?.copy(exceptWords);
  switch (WCDisplay.reduceWordtype(engine?.charInfo[currChar].type!)) {
    case "win":
      break;
    case "los":
      break;
    case "route":
      break;
  }
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
    case "getGameWord":
      getGameWord(
        data as { exceptWords: string[]; currChar: Char; strength: 0 | 1 | 2 }
      );
      return;
  }
};
