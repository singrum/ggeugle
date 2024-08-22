import { arrayToKeyMap, pushObject } from "../utils";
import { getSCC, pruningWinLos, pruningWinLosCir } from "./algorithms";
import { changeableMap, reverseChangeableMap } from "./hangul";
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
  manner: boolean;
};

export type Char = string;
export type CharType = "los" | "win" | "loscir" | "wincir" | "route";
export type WordType = "win" | "los" | "wincir" | "loscir" | "route" | "return";

export type Word = string;

export class WCEngine {
  rule: WCRule;
  words: Word[];
  wordMap: WordMap;
  wordGraph: MultiDiGraph;
  chanGraph: MultiDiGraph;
  returnWordGraph: MultiDiGraph;

  constructor(rule: WCRule, words?: Word[]) {
    this.rule = rule;
    this.wordMap = new WordMap();
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
    wincir: Word[];
    loscir: Word[];
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

export class WCDisplay {
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
    const scc = getSCC(engine.wordGraph, engine.chanGraph, routeChars);
    const maxRouteChars = scc.filter((e) => e.length >= 3).flat();
    const minRouteChars = scc.filter((e) => e.length < 3).flat();
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
      (e) => engine.chanGraph.nodes[e].type === "win"
    );
    const wincirChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "wincir"
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
          (0.5 / Object.keys(win).length) * (Object.keys(win).length - endNum) +
          0.5
        })`,
      }));
    data.push({
      endNum: "-1",
      num: wincirChars.length,
      fill: `hsl(var(--win) / ${0.5})`,
    });
    const config: Record<string, { label: string }> = {};
    data.forEach((e, i) => {
      if (i !== data.length - 1) {
        config[e.endNum] = { label: `${e.endNum}턴` };
      } else {
        config["-1"] = { label: `조건부` };
      }
    });
    return { data, config };
  }
  static losCharTypeChartData(engine: WCEngine) {
    const losChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "los"
    );
    const loscirChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "loscir"
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
          (0.5 / Object.keys(los).length) * (Object.keys(los).length - endNum) +
          0.5
        })`,
      }));
    data.push({
      endNum: "-1",
      num: loscirChars.length,
      fill: `hsl(var(--los) / ${0.5})`,
    });
    const config: Record<string, { label: string }> = {};
    data.forEach((e, i) => {
      if (i !== data.length - 1) {
        config[e.endNum] = { label: `${e.endNum}턴` };
      } else {
        config["-1"] = { label: `조건부` };
      }
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
      wincir: Char[];
      loscir: Char[];
      route: Char[][];
    } = {
      win: [],
      los: [],
      wincir: [],
      loscir: [],
      route: [],
    };
    const win: Record<string, Char[]> = {};
    const los: Record<string, Char[]> = {};
    const chars = Object.keys(engine.chanGraph.nodes);
    chars.sort();

    for (let char of chars) {
      switch (engine.chanGraph.nodes[char].type) {
        case "win":
          pushObject(win, engine.chanGraph.nodes[char].endNum as number, char);
          break;
        case "los":
          pushObject(los, engine.chanGraph.nodes[char].endNum as number, char);
          break;
        case "wincir":
          result.wincir.push(char);
          break;
        case "loscir":
          result.loscir.push(char);
          break;
      }
    }

    const SCC = getSCC(
      engine.chanGraph,
      engine.wordGraph,
      Object.keys(engine.chanGraph.nodes).filter(
        (e) => engine.chanGraph.nodes[e].type === "route"
      )
    );
    for (let scc of SCC!) {
      scc.sort();
    }
    result.route = SCC!.sort((a, b) =>
      b.length === a.length ? (a[0] > b[0] ? 1 : -1) : b.length - a.length
    );

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
  static frequency(engine: WCEngine) {
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

    if (engine.wordGraph.nodes[head].type === "win") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: engine.chanGraph.nodes[tail].endNum as number,
        };
      } else if (engine.chanGraph.nodes[tail].type === "los") {
        return {
          type: "win",
          endNum: engine.chanGraph.nodes[tail].endNum as number,
        };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return { type: "loscir" };
      } else if (engine.chanGraph.nodes[tail].type === "loscir") {
        return { type: "wincir" };
      } else {
        return { type: "route" };
      }
    } else if (engine.wordGraph.nodes[head].type === "los") {
      return {
        type: "los",
        endNum: engine.chanGraph.nodes[tail].endNum as number,
      };
    } else if (engine.wordGraph.nodes[head].type === "wincir") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: engine.chanGraph.nodes[tail].endNum as number,
        };
      } else if (engine.wordGraph.nodes[head].solution === tail) {
        return { type: "wincir" };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return { type: "loscir" };
      } else {
        return { type: "route" };
      }
    } else if (engine.wordGraph.nodes[head].type === "loscir") {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: engine.chanGraph.nodes[tail].endNum as number,
        };
      } else {
        return { type: "loscir" };
      }
    } else {
      if (engine.chanGraph.nodes[tail].type === "win") {
        return {
          type: "los",
          endNum: engine.chanGraph.nodes[tail].endNum as number,
        };
      } else if (engine.chanGraph.nodes[tail].type === "wincir") {
        return { type: "loscir" };
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

  static searchResult(engine: WCEngine, input: string) {
    if (input.length === 0) {
      return undefined;
    }
    if (input.length === 1) {
      const chanSucc = changeableMap[engine.rule.changeableIdx](input).filter(
        (e) => e in engine.wordGraph.nodes
      );

      const chanPred = reverseChangeableMap[engine.rule.changeableIdx](
        input
      ).filter((e) => e in engine.wordGraph.nodes);
      
      const nextWords = chanSucc.flatMap((e) => engine.wordMap.outWords(e));
      const prevWords = chanPred.flatMap((e) => engine.wordMap.inWords(e));
      
      const result: CharSearchResult = {
        startsWith: {
          win: [],
          los: [],
          wincir: [],
          loscir: [],
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

      const startWords = nextWords.sort((a, b) =>
        WCDisplay.compareWord(engine, a, b)
      );
      const endWords = prevWords.sort((a, b) =>
        WCDisplay.compareWord(engine, a, b)
      );

      const returnWords: Record<Char, number> = [...chanSucc].reduce(
        (acc, curr) => ({ ...acc, ...engine.returnWordGraph._succ[curr] }),
        {}
      );

      for (let word of startWords) {
        if (returnWords[word.at(engine.rule.tailIdx)!]) {
          returnWords[word.at(engine.rule.tailIdx)!]--;
          result.startsWith["return"].push(word);
        } else {
          const { type, endNum } = WCDisplay.getWordType(engine, word);
          switch (type) {
            case "win":
              pushObject(startWin, endNum!, word);
              break;
            case "los":
              pushObject(startLos, endNum!, word);
              break;
            default:
              (
                result.startsWith[
                  type as keyof typeof result.startsWith
                ] as Word[]
              ).push(word);
          }
        }
      }

      for (let word of endWords) {
        switch (engine.chanGraph.nodes[word.at(engine.rule.headIdx)!].type) {
          case "los":
            result.endsWith.head_los.push(word);
            break;
          case "win":
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

  static getSolutionTree(engine: WCEngine, char: Char) {
    function getWinTree(
      winWord: Word // winWord
    ) {
      const tree: TreeData = { name: winWord, children: [] };
      const tail = winWord.at(engine.rule.tailIdx)!;

      const losWords = engine.getNextWords(tail);
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
      const tail = losWord.at(engine.rule.tailIdx)!;
      const chanSol = engine.chanGraph.nodes[tail].solution as Char;
      const wordSol = engine.wordGraph.nodes[chanSol].solution as Char;
      const winWord = engine.wordMap.select(chanSol, wordSol)[0];

      tree.children!.push(getWinTree(winWord));
      return tree;
    }

    function getWincirTree(
      winWord: Word, // winWord
      exceptWords: string[]
    ) {
      const tree: TreeData = { name: winWord, children: [] };

      const tail = winWord.at(engine.rule.tailIdx)!;
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
        tree.children!.push(getLoscirTree(losWord, [...exceptWords, losWord]));
      }
      if (losWords.length === 0) {
        delete tree.children;
      }
      return tree;
    }

    function getLoscirTree(losWord: Word, exceptWords: string[]): TreeData {
      const tree: TreeData = { name: losWord, children: [] };
      const tail = losWord.at(engine.rule.tailIdx)!;
      const chanSol = engine.chanGraph.nodes[tail].solution as Char;
      const wordSol = engine.wordGraph.nodes[chanSol].solution as Char;
      const winWord = engine.wordMap.select(chanSol, wordSol)[0];

      tree.children!.push(getWincirTree(winWord, [...exceptWords, winWord]));
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
}

export function objToInstance(obj: WCEngine): WCEngine {
  const result = new WCEngine(obj.rule, obj.words);
  result.wordGraph = objToMultiDiGraph(obj.wordGraph);
  result.chanGraph = objToMultiDiGraph(obj.chanGraph);
  result.wordMap = ObjToWordMap(obj.wordMap);
  result.returnWordGraph = objToMultiDiGraph(obj.returnWordGraph);
  return result;
}
