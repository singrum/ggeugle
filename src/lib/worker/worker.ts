import { RuleForm } from "../store/useWC";

import { getEngine } from "../wc/ruleUpdate";
import { WCEngine, Word } from "../wc/WordChain";

export type payload = {
  action: "getEngine" | "setWords";
  data: unknown;
};
let originalEngine: undefined | WCEngine = undefined;
console.log(1);
const getEngine_ = async (ruleForm: RuleForm) => {
  originalEngine = await getEngine(ruleForm);

  self.postMessage({
    action: "getEngine",
    data: originalEngine,
  });
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

self.onmessage = (event) => {
  const { action, data }: payload = event.data;

  switch (action) {
    case "getEngine":
      getEngine_(data as RuleForm);
      return;
    case "setWords":
      setWords(data as Word[]);
      return;
  }
};
