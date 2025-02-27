import { arrayToKeyMap, pushObject } from "../utils";
import {
  getMaxMinComponents,
  pruningWinLos,
  pruningWinLosCir,
} from "./algorithms";
import { changeableMap, reverseChangeableMap } from "./changeables";
import {
  MultiDiGraph,
  objToMultiDiGraph,
  ObjToWordMap,
  WordMap,
} from "./multidigraph";
// import { DiGraph } from "./multidigraph";
export type WCRule = {
  changeableIdx: number;
  headIdx: number;
  tailIdx: number;
  manner: number;
};

export type Char = string;
export type CharType = "los" | "win" | "loscir" | "wincir" | "route";
export type WordType = "win" | "los" | "wincir" | "loscir" | "route" | "return";

export type Word = string;

export class WCEngine {
  rule: WCRule;
  words: Word[];
  wordMap: WordMap;
  returnWordMap: WordMap;
  wordGraph: MultiDiGraph;
  chanGraph: MultiDiGraph;
  returnWordGraph: MultiDiGraph;

  constructor(rule: WCRule, words?: Word[]) {
    this.rule = rule;
    this.wordMap = new WordMap();
    this.returnWordMap = new WordMap();
    this.words = words ? words : [];
    this.wordGraph = new MultiDiGraph();
    this.chanGraph = new MultiDiGraph();
    this.returnWordGraph = undefined!;
  }

  update() {
    for (let word of this.words) {
      let head = word.at(this.rule.headIdx) as string;
      let tail = word.at(this.rule.tailIdx) as string;
      this.wordGraph.addEdge(head, tail);
      this.wordMap.addWord(head, tail, word);
    }

    for (let char in this.wordGraph.nodes) {
      this.chanGraph.addNode(char);
      changeableMap[this.rule.changeableIdx](char)
        .filter((e) => this.wordGraph.nodes[e] !== undefined)
        .forEach((chan) => {
          this.chanGraph.addEdge(char, chan);
        });
    }

    pruningWinLos(this.chanGraph, this.wordGraph);
    this.returnWordGraph = pruningWinLosCir(this.chanGraph, this.wordGraph);

    // returnWord 분리

    for (let head of Object.keys(this.returnWordGraph.nodes)) {
      for (let tail of this.returnWordGraph.successors(head)) {
        for (let word of this.wordMap
          .select(head, tail)
          .slice(0, this.returnWordGraph._succ[head][tail])) {
          this.returnWordMap.addWord(head, tail, word);
        }
      }
    }
    return this;
  }

  getNextWords(char: Char) {
    return changeableMap[this.rule.changeableIdx](char)
      .filter((e) => this.chanGraph.nodes[e])
      .flatMap((char) => this.wordMap.outWords(char));
  }
  getBestNextLosWord(char: Char) {
    const nexts = this.getNextWords(char);

    return nexts.filter(
      (e) => this.chanGraph.nodes[e.at(this.rule.tailIdx)!].type === "route"
    );
  }

  copy(except?: string[]): WCEngine {
    const engine = new WCEngine(this.rule, this.words);

    if (except && except.length > 0) {
      engine.words = this.words!.filter((e) => !except.includes(e));
      engine.chanGraph.addNode(
        except.flatMap((word) => [
          word.at(this.rule.headIdx)!,
          word.at(this.rule.tailIdx)!,
        ])
      );
      engine.wordGraph.addNode(
        except.flatMap((word) => [
          word.at(this.rule.headIdx)!,
          word.at(this.rule.tailIdx)!,
        ])
      );

      engine.update();
    } else {
      engine.wordGraph = this.wordGraph;
      engine.chanGraph = this.chanGraph;
      engine.returnWordGraph = this.returnWordGraph;
      engine.wordMap = this.wordMap;
      engine.returnWordMap = this.returnWordMap;
    }

    return engine;
  }
}

export type SearchResult =
  | undefined
  | {
      isChar: boolean;
      result: CharSearchResult | NoncharSearchResult;
    };

export type CharSearchResult = {
  startsWith: {
    win: { endNum: number; words: Word[] }[];
    los: { endNum: number; words: Word[] }[];
    route: Word[];
    return: Word[];
  };
  endsWith: {
    head_los: Word[];
    head_route: Word[];
    rest: Word[];
  };
};

export type NoncharSearchResult = {
  startsWith: Word[];
  endsWith: Word[];
};

export type TreeData = {
  name: string;
  children?: TreeData[];
};

export type TreeInfo = {
  type: "win" | "los";
  win: Word[];
  los: { mainIdx: number; words: Word[] }[];
};
export class WCDisplay {
  static isCriticalChar(engine: WCEngine, char: Char) {
    const chanSucc = engine.chanGraph.successors(char);
    let criticalWord: Char[] = [];
    let counter = 0;

    for (const head of chanSucc) {
      const wordSucc = engine.wordGraph.successorsWithMultiplicity(head);
      for (const tail in wordSucc) {
        counter += wordSucc[tail];
        criticalWord = [head, tail];
        if (counter > 1) {
          return false;
        }
      }
    }

    return criticalWord;
  }
  static getCriticalWords(engine: WCEngine) {
    const routeChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    );
    // const winChars = Object.keys(engine.chanGraph.nodes).filter(
    //   (e) =>
    //     engine.chanGraph.nodes[e].type === "win" ||
    //     engine.chanGraph.nodes[e].type === "wincir"
    // );

    const predRouteNums = arrayToKeyMap(
      routeChars,
      (e) =>
        engine.chanGraph.predecessors(engine.wordGraph.predecessors(e)).length
    );
    // const predWinNums = arrayToKeyMap(
    //   winChars,
    //   (e) =>
    //     engine.chanGraph.predecessors(engine.wordGraph.predecessors(e)).length
    // );

    routeChars.sort((a, b) => -predRouteNums[a] + predRouteNums[b]);
    // winChars.sort((a, b) => -predWinNums[a] + predWinNums[b]);

    const criticalWords: {
      maxRoute: Word[];
      minRoute: Word[];
      // win: Word[]
    } = {
      maxRoute: [],
      minRoute: [],
      // win: [],
    };

    const [maxRouteChars, _] = getMaxMinComponents(
      engine.chanGraph,
      engine.wordGraph,
      routeChars
    );

    const maxRouteCharsSet = new Set(maxRouteChars);

    for (const routeChar of routeChars) {
      const cchar = this.isCriticalChar(engine, routeChar);

      if (cchar) {
        const returnWords = engine.returnWordMap.select(cchar[0], cchar[1]);
        const word = engine.wordMap
          .select(cchar[0], cchar[1])
          .filter((e) => !returnWords.includes(e))[0];
        if (
          maxRouteCharsSet.has(cchar[0]) &&
          !criticalWords.maxRoute.includes(word)
        ) {
          criticalWords.maxRoute.push(word);
        } else if (!criticalWords.minRoute.includes(word)) {
          criticalWords.minRoute.push(word);
        }
      }
    }

    return criticalWords;
  }

  static getSolutionWord(engine: WCEngine, char: Char) {
    const chanSol = engine.chanGraph.nodes[char].solution;
    const wordSol = engine.wordGraph.nodes[chanSol as string].solution;
    //(?!(균핵균|균축|축알못|못핀|핀지가죽|죽력죽|죽견|견소포자균|균형|형촉|촉륜|륜곽|곽재겸|겸지우겸|겸괘|괘견|견융|융즉|즉견|견취견|견사혹|혹돔|돔뱀|뱀뱀|뱀톱|톱니형|형애긍|긍휼|휼형|형삭|삭즉삭|삭스핀|핀치가죽|죽는시늉|융복합형|형개이삭)$).*

    return engine.wordMap.select(chanSol as string, wordSol as string);
  }
  static getWinWord(engine: WCEngine, char: Char) {
    const nextWords = engine
      .getNextWords(char)
      .filter(
        (word) =>
          WCDisplay.getWordType(engine, word).type === "win" ||
          WCDisplay.getWordType(engine, word).type === "wincir"
      );
    return nextWords.reduce(
      (curr, acc) =>
        WCDisplay.getWordType(engine, curr).endNum! <
        WCDisplay.getWordType(engine, acc).endNum!
          ? curr
          : acc,
      nextWords[0]
    );
  }
  static getLosWord(engine: WCEngine, char: Char) {
    const nextWords = engine
      .getNextWords(char)
      .filter(
        (word) =>
          WCDisplay.getWordType(engine, word).type === "los" ||
          WCDisplay.getWordType(engine, word).type === "loscir"
      );
    if (nextWords.length === 0) return undefined;
    else
      return nextWords.reduce(
        (curr, acc) =>
          WCDisplay.getWordType(engine, curr).endNum! >
          WCDisplay.getWordType(engine, acc).endNum!
            ? curr
            : acc,
        nextWords[0]
      );
  }
  static getLosWords(engine: WCEngine, char: Char) {
    const nextWords = engine
      .getNextWords(char)
      .filter(
        (word) =>
          WCDisplay.getWordType(engine, word).type === "los" ||
          WCDisplay.getWordType(engine, word).type === "loscir"
      );

    return nextWords.sort(
      (a, b) =>
        -WCDisplay.getWordType(engine, a).endNum! +
        WCDisplay.getWordType(engine, b).endNum!
    );
  }
  static getMaxTrail(engine: WCEngine, char: Char) {
    const trail = [];
    if (
      engine.chanGraph.nodes[char].type === "win" ||
      engine.chanGraph.nodes[char].type === "wincir"
    ) {
      // 승일 때
      const winWord = this.getSolutionWord(engine, char)[0];
      trail.push(winWord);

      char = winWord.at(engine.rule.tailIdx)!;
    }
    let cnt = 0;
    while (true) {
      cnt++;
      if (cnt > 200) {
        break;
      }

      const losWord = this.getLosWord(engine, char);
      if (!losWord) {
        break;
      }
      trail.push(losWord);
      char = losWord.at(engine.rule.tailIdx)!;
      const winWord = this.getSolutionWord(engine, char)[0];
      trail.push(winWord);
      char = winWord.at(engine.rule.tailIdx)!;
    }

    return trail;
  }
  static getTree(engine: WCEngine, char: Char) {
    const treeInfo: TreeInfo = {
      type:
        engine.chanGraph.nodes[char].type === "win" ||
        engine.chanGraph.nodes[char].type === "wincir"
          ? "win"
          : "los",
      win: [],
      los: [],
    };
    if (treeInfo.type === "win") {
      // 승일 때
      const winWord = this.getSolutionWord(engine, char)[0];
      treeInfo.win.push(winWord);
      char = winWord.at(engine.rule.tailIdx)!;
    }
    let cnt = 0;
    while (true) {
      cnt++;
      if (cnt > 200) {
        break;
      }

      const losWords = this.getLosWords(engine, char);

      if (losWords.length === 0) {
        break;
      }
      treeInfo.los.push({ mainIdx: 0, words: losWords });

      char = losWords[0].at(engine.rule.tailIdx)!;
      const winWord = this.getSolutionWord(engine, char)[0];
      treeInfo.win.push(winWord);
      char = winWord.at(engine.rule.tailIdx)!;
    }

    return treeInfo;
  }
  static changeTree(
    engine: WCEngine,
    treeInfo: TreeInfo,
    losIdx: number,
    wordIdx: number
  ) {
    treeInfo.los[losIdx].mainIdx = wordIdx;

    treeInfo.los.length = losIdx + 1;
    treeInfo.win.length = losIdx + (treeInfo.type === "win" ? 1 : 0);
    let char = treeInfo.los[losIdx].words[wordIdx].at(engine.rule.tailIdx)!;
    let cnt = 0;
    while (true) {
      cnt++;
      if (cnt > 200) {
        break;
      }
      const winWord = this.getSolutionWord(engine, char)[0];
      treeInfo.win.push(winWord);
      char = winWord.at(engine.rule.tailIdx)!;
      const losWords = this.getLosWords(engine, char);
      if (losWords.length === 0) {
        break;
      }
      treeInfo.los.push({ mainIdx: 0, words: losWords });
      char = losWords[0].at(engine.rule.tailIdx)!;
    }
    return treeInfo;
  }
  static getCharType(engine: WCEngine, char: Char) {
    const types = changeableMap[engine.rule.changeableIdx](char)
      .filter((e) => engine.wordGraph.nodes[e])
      .map((e) =>
        WCDisplay.reduceWordtype(engine.wordGraph.nodes[e].type as WordType)
      );
    return types.includes("win")
      ? "win"
      : types.includes("route")
      ? "route"
      : "los";
  }

  static routeCharTypeChartData(engine: WCEngine) {
    const routeChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    );
    const [maxRouteChars, minRouteChars] = getMaxMinComponents(
      engine.wordGraph,
      engine.chanGraph,
      routeChars
    );
    const data = [
      {
        name: "maxRouteChars",
        num: maxRouteChars.length,
        fill: `hsl(var(--route))`,
      },
      {
        name: "minRouteChars",
        num: minRouteChars.length,
        fill: `hsl(var(--route) / 0.8)`,
      },
    ];
    const config = {
      minRouteChars: { label: "희귀 루트" },
      maxRouteChars: { label: "주요 루트" },
    };
    return { data, config };
  }
  static winCharTypeChartData(engine: WCEngine) {
    const winChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) =>
        engine.chanGraph.nodes[e].type === "win" ||
        engine.chanGraph.nodes[e].type === "wincir"
    );

    const win: Record<string, string[]> = {};
    for (let char of winChars) {
      pushObject(win, engine.chanGraph.nodes[char].endNum as number, char);
    }
    const data = Object.keys(win)
      .map((e) => parseInt(e))
      .sort((a, b) => a - b)
      .map((endNum) => ({
        endNum: `${endNum}`,
        num: win[endNum].length,
        fill: `hsl(var(--win) / ${
          (0.5 / Object.keys(win).length) *
            (Object.keys(win).length - Math.floor(endNum / 2)) +
          0.5
        })`,
      }));

    const config: Record<string, { label: string }> = {};
    data.forEach((e) => {
      config[e.endNum] = { label: `${e.endNum}턴` };
    });
    return { data, config };
  }
  static losCharTypeChartData(engine: WCEngine) {
    const losChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) =>
        engine.chanGraph.nodes[e].type === "los" ||
        engine.chanGraph.nodes[e].type === "loscir"
    );

    const los: Record<string, string[]> = {};
    for (let char of losChars) {
      pushObject(los, engine.chanGraph.nodes[char].endNum as number, char);
    }
    const data = Object.keys(los)
      .map((e) => parseInt(e))
      .sort((a, b) => a - b)
      .map((endNum) => ({
        endNum: `${endNum}`,
        num: los[endNum].length,
        fill: `hsl(var(--los) / ${
          (0.5 / Object.keys(los).length) *
            (Object.keys(los).length - Math.floor(endNum / 2)) +
          0.5
        })`,
      }));
    const config: Record<string, { label: string }> = {};
    data.forEach((e) => {
      config[e.endNum] = { label: `${e.endNum}턴` };
    });
    return { data, config };
  }
  static routeComparisonChartData(engine: WCEngine) {
    const routeChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    ).length;
    const routeWords = engine.words
      .filter(
        (word) =>
          engine.wordGraph.nodes[word.at(engine.rule.headIdx)!].type ===
            "route" &&
          engine.chanGraph.nodes[word.at(engine.rule.tailIdx)!].type === "route"
      )
      .filter(
        (word) => WCDisplay.getWordType(engine, word).type === "route"
      ).length;
    const averageWords = routeWords / routeChars;
    return [
      { data: "routeChars", currentRule: routeChars, guelRule: routeChars },
      { data: "routeWords", currentRule: routeWords, guelRule: routeWords },
      {
        data: "averageWords",
        currentRule: averageWords,
        guelRule: averageWords,
      },
    ];
  }
  static charTypeChartData(engine: WCEngine) {
    const chars = Object.keys(engine.chanGraph.nodes);

    const chartData = [
      {
        type: "win",

        num: chars.filter(
          (e) =>
            engine.chanGraph.nodes[e].type === "win" ||
            engine.chanGraph.nodes[e].type === "wincir"
        ).length,
        fill: "hsl(var(--win))",
      },

      {
        type: "los",
        num: chars.filter(
          (e) =>
            engine.chanGraph.nodes[e].type === "los" ||
            engine.chanGraph.nodes[e].type === "loscir"
        ).length,
        fill: "hsl(var(--los))",
      },
      {
        type: "route",
        num: chars.filter((e) => engine.chanGraph.nodes[e].type === "route")
          .length,
        fill: "hsl(var(--route))",
      },
    ];
    return chartData;
  }
  static endInN(engine: WCEngine) {
    const result: {
      win: { endNum: number; chars: Char[] }[];
      los: { endNum: number; chars: Char[] }[];

      route: { maxComp: Char[]; minComp: Char[] };
    } = {
      win: [],
      los: [],
      route: { maxComp: [], minComp: [] },
    };
    const win: Record<string, Char[]> = {};
    const los: Record<string, Char[]> = {};
    const chars = Object.keys(engine.chanGraph.nodes);
    chars.sort();

    for (let char of chars) {
      switch (engine.chanGraph.nodes[char].type) {
        case "win":
        case "wincir":
          pushObject(win, engine.chanGraph.nodes[char].endNum as number, char);
          break;
        case "los":
        case "loscir":
          pushObject(los, engine.chanGraph.nodes[char].endNum as number, char);
          break;
      }
    }

    [result.route.maxComp, result.route.minComp] = getMaxMinComponents(
      engine.chanGraph,
      engine.wordGraph,
      Object.keys(engine.chanGraph.nodes).filter(
        (e) => engine.chanGraph.nodes[e].type === "route"
      )
    ).map((e) => e.sort());

    result.win = Object.keys(win)
      .map((e) => parseInt(e))
      .sort((a, b) => a - b)
      .map((endNum) => ({ endNum, chars: win[endNum] }));

    result.los = Object.keys(los)
      .map((e) => parseInt(e))
      .sort((a, b) => a - b)
      .map((endNum) => ({ endNum, chars: los[endNum] }));

    return result;
  }

  static startsWithNum(engine: WCEngine) {
    const result = arrayToKeyMap(Object.keys(engine.chanGraph.nodes), () => 0);

    for (let word of engine.words) {
      reverseChangeableMap[engine.rule.changeableIdx](
        word.at(engine.rule.headIdx)!
      ).forEach((char) => {
        result[char]++;
      });
    }

    const routes = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    );
    for (let char of routes) {
      result[char] = engine.chanGraph
        .successors(char)
        .reduce(
          (acc1, head) =>
            acc1 +
            engine.wordGraph
              .successors(head)
              .reduce(
                (acc2, curr) => engine.wordGraph._succ[head][curr] + acc2,
                0
              ),
          0
        );
    }

    return result;
  }
  static endsWithNum(engine: WCEngine) {
    const result = arrayToKeyMap(Object.keys(engine.chanGraph.nodes), () => 0);

    for (let word of engine.words) {
      changeableMap[engine.rule.changeableIdx](
        word.at(engine.rule.tailIdx)!
      ).forEach((char) => {
        result[char]++;
      });
    }

    const routes = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    );
    for (let char of routes) {
      result[char] = engine.wordGraph
        .predecessors(char)
        .reduce((acc, curr) => engine.wordGraph._pred[char][curr] + acc, 0);
    }

    return result;
  }

  // wordType : win, los, wincir, loscir, route, return, return
  static getWordType(
    engine: WCEngine,
    word: Word
  ): { type: string; endNum?: number } {
    const head = word.at(engine.rule.headIdx)!;
    const tail = word.at(engine.rule.tailIdx)!;

    if (
      engine.returnWordMap.hasEdge(head, tail) &&
      engine.returnWordMap.select(head, tail).includes(word)
    ) {
      return { type: "return" };
    } else if (engine.wordGraph.nodes[head].type === "win") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (engine.chanGraph.nodes[tail].type === "los") {
        return {
          type: "win",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return {
          type: "loscir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (
        engine.chanGraph.nodes[tail].type === "loscir"
        // &&(engine.chanGraph.nodes[head].endNum as number) <=
        //   (engine.chanGraph.nodes[tail].endNum as number) + 1
      ) {
        return {
          type: "wincir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else {
        return { type: "route" };
      }
    } else if (engine.wordGraph.nodes[head].type === "los") {
      return {
        type: "los",
        endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
      };
    } else if (engine.wordGraph.nodes[head].type === "wincir") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (
        engine.chanGraph.nodes[tail].type === "loscir"
        // &&(engine.chanGraph.nodes[head].endNum as number) <=
        //   (engine.chanGraph.nodes[tail].endNum as number) + 1
      ) {
        return {
          type: "wincir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (engine.wordGraph.nodes[head].solution == tail) {
        return {
          type: "wincir",
          endNum: engine.chanGraph.nodes[head].endNum as number,
        };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return {
          type: "loscir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else {
        return { type: "route" };
      }
    } else if (engine.wordGraph.nodes[head].type === "loscir") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else {
        return {
          type: "loscir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      }
    } else {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return {
          type: "loscir",
          endNum: (engine.chanGraph.nodes[tail].endNum as number) + 1,
        };
      } else {
        return { type: "route" };
      }
    }
  }
  static compareWord(engine: WCEngine, a: Word, b: Word) {
    const ahead = a.at(engine.rule.headIdx)!;
    const bhead = b.at(engine.rule.headIdx)!;
    const atail = a.at(engine.rule.tailIdx)!;
    const btail = b.at(engine.rule.tailIdx)!;
    if (ahead > bhead) return 1;
    if (ahead < bhead) return -1;
    if (atail > btail) return 1;
    if (atail < btail) return -1;
    return a >= b ? 1 : -1;
  }

  static searchResult(
    engine: WCEngine,
    input: string,
    applyChan?: boolean,
    deleteMult?: boolean,
    podoSort?: boolean
  ) {
    if (input.length === 0) {
      return undefined;
    }
    if (input.length === 1) {
      let nextWords, prevWords;

      if (applyChan) {
        const chanSucc = changeableMap[engine.rule.changeableIdx](input).filter(
          (e) => e in engine.wordGraph.nodes
        );

        const chanPred = reverseChangeableMap[engine.rule.changeableIdx](
          input
        ).filter((e) => e in engine.wordGraph.nodes);

        nextWords = chanSucc.flatMap((e) => engine.wordMap.outWords(e));
        prevWords = chanPred.flatMap((e) => engine.wordMap.inWords(e));
      } else {
        nextWords = engine.wordMap.outWords(input);
        prevWords = engine.wordMap.inWords(input);
      }

      if (deleteMult) {
        nextWords = removeHeadTailDuplication(
          nextWords,
          engine.rule.headIdx,
          engine.rule.tailIdx
        );
        prevWords = removeHeadTailDuplication(
          prevWords,
          engine.rule.headIdx,
          engine.rule.tailIdx
        );
      }

      const result: CharSearchResult = {
        startsWith: {
          win: [],
          los: [],
          route: [],
          return: [],
        },
        endsWith: {
          head_los: [],
          head_route: [],
          rest: [],
        },
      };

      const startWin: Record<string, Word[]> = {};
      const startLos: Record<string, Word[]> = {};

      if (podoSort) {
        nextWords.sort((a, b) => WCDisplay.compareWord(engine, a, b));
      } else {
        nextWords.sort();
      }
      const startWords = nextWords;

      if (podoSort) {
        prevWords.sort((a, b) => WCDisplay.compareWord(engine, a, b));
      } else {
        prevWords.sort();
      }
      const endWords = prevWords;

      for (let word of startWords) {
        const { type, endNum } = WCDisplay.getWordType(engine, word);

        switch (type) {
          case "win":
          case "wincir":
            pushObject(startWin, endNum!, word);
            break;
          case "los":
          case "loscir":
            pushObject(startLos, endNum!, word);
            break;
          default:
            (
              result.startsWith[
                type as keyof typeof result.startsWith
              ] as Word[]
            ).push(word);
          // }
        }
      }

      for (let word of endWords) {
        switch (engine.chanGraph.nodes[word.at(engine.rule.headIdx)!].type) {
          case "los":
          case "loscir":
            result.endsWith.head_los.push(word);
            break;
          case "win":
          case "wincir":
            result.endsWith.rest.push(word);
            break;
          default:
            result.endsWith.head_route.push(word);
            break;
        }
      }

      result.startsWith.win = Object.keys(startWin)
        .map((e) => parseInt(e))
        .sort((a, b) => a - b)
        .map((endNum) => ({ endNum, words: startWin[endNum] }));

      result.startsWith.los = Object.keys(startLos)
        .map((e) => parseInt(e))
        .sort((a, b) => a - b)
        .reverse()
        .map((endNum) => ({ endNum, words: startLos[endNum] }));

      return { isChar: true, result };
    } else {
      const startsWith = engine.words.filter((e) => e.startsWith(input)).sort();
      const endsWith = engine.words.filter((e) => e.endsWith(input)).sort();
      const result = { startsWith, endsWith };
      return { isChar: false, result };
    }
  }
  static reduceWordtype(
    wordType: WordType | CharType
  ): "win" | "los" | "route" {
    switch (wordType) {
      case "win":
      case "wincir":
        return "win";
      case "los":
      case "loscir":
        return "los";
      case "route":
      case "return":
        return "route";
    }
  }
  static reduceWordtypeWithReturn(
    wordType: WordType | CharType
  ): "win" | "los" | "route" | "return" {
    switch (wordType) {
      case "win":
      case "wincir":
        return "win";
      case "los":
      case "loscir":
        return "los";
      case "route":
        return "route";
      case "return":
        return "return";
    }
  }
  static getSolutionTree(engine: WCEngine, char: Char) {
    function getWinTree(
      winWord: Word // winWord
    ) {
      const tree: TreeData = { name: winWord, children: [] };
      const tail =
        winWord.length === 1 ? winWord : winWord.at(engine.rule.tailIdx)!;

      const losWords = engine
        .getNextWords(tail)
        .filter(
          (word) =>
            !engine.returnWordMap.hasEdge(
              word.at(engine.rule.headIdx)!,
              word.at(engine.rule.tailIdx)!
            ) ||
            !engine.returnWordMap
              .select(
                word.at(engine.rule.headIdx)!,
                word.at(engine.rule.tailIdx)!
              )
              .includes(word)
        );

      losWords.sort(
        (a, b) =>
          -(engine.chanGraph.nodes[a.at(engine.rule.tailIdx)!]
            .endNum as number) +
          (engine.chanGraph.nodes[b.at(engine.rule.tailIdx)!].endNum as number)
      );
      for (let losWord of losWords) {
        tree.children!.push(getLosTree(losWord));
      }
      if (losWords.length === 0) {
        delete tree.children;
      }
      return tree;
    }
    function getLosTree(losWord: Word): TreeData {
      const tree: TreeData = { name: losWord, children: [] };
      const tail =
        losWord.length === 1 ? losWord : losWord.at(engine.rule.tailIdx)!;

      const chanSol = engine.chanGraph.nodes[tail].solution as Char;
      const wordSol = engine.wordGraph.nodes[chanSol].solution as Char;
      const winWord = engine.wordMap.select(chanSol, wordSol)[0];

      tree.children!.push(getWinTree(winWord));
      return tree;
    }

    let counter = 0;
    function getWincirTree(
      winWord: Word, // winWord
      exceptWords: string[]
    ): TreeData | undefined {
      counter += 1;
      if (counter > 500) {
        return undefined;
      }
      const tree: TreeData = { name: winWord, children: [] };

      const tail =
        winWord.length === 1 ? winWord : winWord.at(engine.rule.tailIdx)!;
      const chanSucc = changeableMap[engine.rule.changeableIdx](char).filter(
        (e) => engine.chanGraph.nodes[e]
      );

      const returnWords: Record<Char, number> = [...chanSucc].reduce(
        (acc, curr) => ({ ...acc, ...engine.returnWordGraph._succ[curr] }),
        {}
      );

      const losWords = engine
        .getNextWords(tail)
        .filter(
          (e) =>
            engine.chanGraph.nodes[e.at(engine.rule.tailIdx)!].type === "wincir"
        )
        .filter((word) => {
          if (returnWords[word.at(engine.rule.tailIdx)!]) {
            returnWords[word.at(engine.rule.tailIdx)!]--;
            return false;
          } else {
            return true;
          }
        })
        .filter(
          (word, _, arr) =>
            arr.find(
              (e) =>
                e.at(engine.rule.headIdx) === word.at(engine.rule.headIdx) &&
                e.at(engine.rule.tailIdx) === word.at(engine.rule.tailIdx)
            ) === word
        )
        .filter((word) => !exceptWords.includes(word));

      losWords.sort(
        (a, b) =>
          -(engine.chanGraph.nodes[a.at(engine.rule.tailIdx)!]
            .endNum as number) +
          (engine.chanGraph.nodes[b.at(engine.rule.tailIdx)!].endNum as number)
      );

      for (let losWord of losWords) {
        const loscirTree = getLoscirTree(losWord, [...exceptWords, losWord]);
        if (loscirTree) {
          tree.children!.push(loscirTree);
        } else {
          return undefined;
        }
      }
      if (losWords.length === 0) {
        delete tree.children;
      }
      return tree;
    }

    function getLoscirTree(
      losWord: Word,
      exceptWords: string[]
    ): TreeData | undefined {
      counter += 1;
      if (counter > 500) {
        return undefined;
      }
      const tree: TreeData = { name: losWord, children: [] };
      const tail =
        losWord.length === 1 ? losWord : losWord.at(engine.rule.tailIdx)!;
      const chanSol = engine.chanGraph.nodes[tail].solution as Char;
      const wordSol = engine.wordGraph.nodes[chanSol].solution as Char;
      const winWord = engine.wordMap.select(chanSol, wordSol)[0];

      const wincirTree = getWincirTree(winWord, [...exceptWords, winWord]);
      if (wincirTree) {
        tree.children!.push(wincirTree);
      } else {
        return undefined;
      }

      return tree;
    }

    switch (engine.chanGraph.nodes[char].type) {
      case "win":
        return getLosTree(char);
      case "los":
        return getWinTree(char);
      case "wincir":
        return getLoscirTree(char, []);
      case "loscir":
        return getWincirTree(char, []);
    }
  }
  static downloadWinWords(engine: WCEngine) {
    return Object.keys(engine.chanGraph.nodes)
      .filter(
        (e) =>
          engine.chanGraph.nodes[e].type == "win" ||
          engine.chanGraph.nodes[e].type == "wincir"
      )
      .sort()
      .map((winChar) => {
        const result = (
          this.searchResult(engine, winChar)!.result as CharSearchResult
        ).startsWith;
        let charInfo = `[${winChar}]\n`;
        for (const { endNum, words } of result.win) {
          charInfo = charInfo.concat(`${endNum}턴 : ${words.join(", ")}\n`);
        }

        return charInfo;
      })
      .join("\n");
  }
  static downloadWinWordsEssential(engine: WCEngine) {
    return Object.keys(engine.chanGraph.nodes)
      .filter(
        (e) =>
          engine.chanGraph.nodes[e].type == "win" ||
          engine.chanGraph.nodes[e].type == "wincir"
      )
      .sort()
      .map((winChar) => {
        const chanSol = engine.chanGraph.nodes[winChar].solution as Char;
        const wordSol = engine.wordGraph.nodes[
          engine.chanGraph.nodes[chanSol].solution as Char
        ].solution as Char;

        let charInfo = `${winChar} : ${
          engine.wordMap.select(chanSol, wordSol)[0]
        }`;

        return charInfo;
      })
      .join("\n");
  }
  static downloadLosWords(engine: WCEngine) {
    return Object.keys(engine.chanGraph.nodes)
      .filter(
        (e) =>
          engine.chanGraph.nodes[e].type == "los" ||
          engine.chanGraph.nodes[e].type == "loscir"
      )
      .sort()
      .map((losChar) => {
        const result = (
          this.searchResult(engine, losChar)!.result as CharSearchResult
        ).startsWith;
        let charInfo = `[${losChar}]\n`;
        if (result.return.length > 0) {
          charInfo = charInfo.concat(`돌림 : ${result.return.join(", ")}\n`);
        }
        for (const { endNum, words } of result.los) {
          charInfo = charInfo.concat(`${endNum}턴 : ${words.join(", ")}\n`);
        }

        return charInfo;
      })
      .join("\n");
  }
  static downloadRouteWords(engine: WCEngine) {
    return Object.keys(engine.chanGraph.nodes)
      .filter((e) => engine.chanGraph.nodes[e].type == "route")
      .sort()
      .map((losChar) => {
        const result = (
          this.searchResult(engine, losChar)!.result as CharSearchResult
        ).startsWith;
        let charInfo = `[${losChar}]\n`;
        if (result.route.length > 0) {
          charInfo = charInfo.concat(`루트 : ${result.route.join(", ")}\n`);
        }
        if (result.return.length > 0) {
          charInfo = charInfo.concat(`돌림 : ${result.return.join(", ")}\n`);
        }

        return charInfo;
      })
      .join("\n");
  }
  static downloadCharInfo(engine: WCEngine) {
    const info = this.endInN(engine);
    return info.win
      .map(
        ({ endNum, chars }) => `[${endNum} 턴 이내 승리]\n${chars.join(" ")}`
      )
      .join("\n\n")
      .concat("\n\n")
      .concat(
        info.los
          .map(
            ({ endNum, chars }) =>
              `[${endNum} 턴 이내 패배]\n${chars.join(" ")}`
          )
          .join("\n\n")
      )
      .concat(
        info.route.maxComp.length > 0
          ? "\n\n".concat(`[주요 루트]\n${info.route.maxComp.join(" ")}`)
          : ""
      )
      .concat(
        info.route.minComp.length > 0
          ? "\n\n".concat(`[희귀 루트]\n${info.route.minComp.join(" ")}`)
          : ""
      );
  }
}

export function objToInstance(obj: WCEngine): WCEngine {
  const result = new WCEngine(obj.rule, obj.words);
  result.wordGraph = objToMultiDiGraph(obj.wordGraph);
  result.chanGraph = objToMultiDiGraph(obj.chanGraph);
  result.wordMap = ObjToWordMap(obj.wordMap);
  result.returnWordMap = ObjToWordMap(obj.returnWordMap);
  result.returnWordGraph = objToMultiDiGraph(obj.returnWordGraph);
  return result;
}

export function removeHeadTailDuplication(
  words: string[],
  headIdx: number,
  tailIdx: number
) {
  const cache: Set<string> = new Set();
  const result = [];
  for (const word of words) {
    const head = word.at(headIdx)!;
    const tail = word.at(tailIdx)!;
    const reducedWord = head.concat(tail);
    if (cache.has(reducedWord)) {
      continue;
    } else {
      cache.add(reducedWord);
    }
    result.push(word);
  }

  return result;
}
