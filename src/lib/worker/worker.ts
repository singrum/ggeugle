import { RuleForm } from "../store/useWC";

import { getEngine } from "../wc/ruleUpdate";
import { WCEngine, Word } from "../wc/wordChain";

export type payload = {
  action: "getEngine" | "setWords";
  data: unknown;
};
let mainEngine: undefined | WCEngine = undefined;
let fullWords: undefined | Word[] = undefined;

const getEngine_ = async (ruleForm: RuleForm) => {
  console.log(ruleForm);
  mainEngine = await getEngine(ruleForm);
  fullWords = mainEngine.words;
  const { rule, charInfo, words, SCC } = mainEngine;

  self.postMessage({
    action: "getEngine",
    data: { rule, charInfo, words, SCC },
  });
};

const setWords = (exceptWords: Word[]) => {
  mainEngine!.words = fullWords!.filter((e) => !exceptWords.includes(e));
  mainEngine!.charInfo = {};
  mainEngine!.update();
  mainEngine!.sortRouteChars();

  const { rule, charInfo, words, SCC } = mainEngine!;
  self.postMessage({
    action: "getEngine",
    data: { rule, charInfo, words, SCC },
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
