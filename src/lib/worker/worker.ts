import { RuleForm } from "../store/useWC";
import { compareWord } from "../utils";
import { getEngine } from "../wc/ruleUpdate";
import { LOS, LOSCIR, ROUTE, WCengine, WIN, WINCIR } from "../wc/WordChain";

export type payload = {
  action: "setEngine" | "getWordClass" | "setWords";
  data: unknown;
};

let mainEngine: null | WCengine = null;

const setEngine = async (rule: RuleForm) => {
  mainEngine = await getEngine(rule);
  getCharClass();
};

const getCharClass = () => {
  const win = Object.keys(mainEngine!.winCharClass)
    .sort((a, b) => -parseInt(b) + parseInt(a))
    .map((i) => {
      return {
        key: i,
        chars: mainEngine!.winCharClass[i].sort(),
      };
    });
  win.push({ key: "wincir", chars: mainEngine!.winCirChars.sort() });

  const los = Object.keys(mainEngine!.losCharClass)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map((i) => {
      return { key: i, chars: mainEngine!.losCharClass[i].sort() };
    });
  los.push({ key: "loscir", chars: mainEngine!.losCirChars.sort() });
  mainEngine!.sccs.forEach((e) => e.sort());
  const route = mainEngine!.sccs.sort((a, b) =>
    b.length === a.length ? (a[0] > b[0] ? 1 : -1) : b.length - a.length
  );

  const winFreq = mainEngine!.winChars.concat(mainEngine!.winCirChars);
  const losFreq = mainEngine!.losChars.concat(mainEngine!.losCirChars);
  const routeFreq = mainEngine!.routeChars;
  self.postMessage({
    action: "initData",
    data: {
      words: mainEngine!.word_list,
      charClass: {
        endInN: { win, los, route },
        frequency: { win: winFreq, los: losFreq, route: routeFreq },
      },
    },
  });
};

const getWordClass = (query: string) => {
  let wc;
  let inWc;
  if (query.length === 1) {
    if (!mainEngine!.charMap[query]) {
      self.postMessage({
        action: "getWordClass",
        data: undefined,
      });
      return;
    }
    wc = mainEngine!.charMap[query].wordClass;
    inWc = mainEngine!.makeInWordClass(
      query,
      mainEngine!.charMap[query].inWords!
    );
  } else if (query.length > 1) {
    const words = mainEngine!.word_list.filter((e) => e.startsWith(query));
    const inWords = mainEngine!.word_list.filter((e) => e.endsWith(query));

    if (words.length > 0) {
      wc = mainEngine!.makeWordClass(mainEngine!.rule.head(query), words);
    }
    if (inWords.length > 0) {
      inWc = mainEngine!.makeInWordClass(mainEngine!.rule.tail(query), inWords);
    }
  } else {
    self.postMessage({
      action: "getWordClass",
      data: undefined,
    });
    return;
  }
  if (wc) {
    Object.values(wc!).forEach((e) => e.sort(compareWord));
  }
  if (inWc) {
    Object.values(inWc!).forEach((e) => e.sort(compareWord));
  }

  self.postMessage({
    action: "getWordClass",
    data: {
      outWordClass: wc,
      inWordClass: inWc,
    },
  });
};

const setWords = ({
  words,
  operation,
  autoSearch,
}: {
  words: string[];
  operation: "remove" | "add";
  autoSearch?: boolean;
}) => {
  switch (operation) {
    case "remove":
      mainEngine!.word_list = mainEngine!.word_list.filter(
        (e) => !words.includes(e)
      );

      break;
    case "add":
      mainEngine!.word_list = mainEngine!.word_list.concat(words);
      break;
  }
  mainEngine!.update();
  mainEngine!.getRouteComp();

  if (autoSearch) {
    getCharClass();
    getWordClass(mainEngine!.rule.tail(words[words.length - 1]));
  }
};

self.onmessage = (event) => {
  const { action, data }: payload = event.data;

  switch (action) {
    case "setEngine":
      setEngine(data as RuleForm);
      return;
    // case "getCharClass":
    //   getCharClass();
    //   return;
    case "getWordClass":
      getWordClass(data as string);
      return;
    case "setWords":
      setWords(
        data as {
          words: string[];
          operation: "remove" | "add";
          autoSearch?: boolean;
        }
      );
      return;
  }
};
