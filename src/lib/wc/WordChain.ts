import * as Collections from "typescript-collections";
import { changeableMap, reverseChangeableMap } from "./hangul";
import { arrayToKeyMap, pushObject } from "../utils";
import { indexOf } from "typescript-collections/dist/lib/arrays";
import { MultiDiGraph, objToMultiDiGraph } from "./multidigraph";
import { getSCC, pruningWinLos, pruningWinLosCir } from "./algorithms";
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
  wordGraph: MultiDiGraph;
  chanGraph: MultiDiGraph;
  returnWordGraph: MultiDiGraph;

  constructor(rule: WCRule, words?: Word[]) {
    this.rule = rule;
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
    }

    for (let char in this.wordGraph.nodes) {
      changeableMap[this.rule.changeableIdx](char)
        .filter((e) => this.wordGraph.nodes[e])
        .forEach((chan) => {
          this.chanGraph.addEdge(char, chan);
        });
    }

    pruningWinLos(this.chanGraph, this.wordGraph);
    pruningWinLosCir(this.chanGraph, this.wordGraph);

    return this;
  }

  getNextWords(char: Char) {
    return changeableMap[this.rule.changeableIdx](char)
      .filter((e) => this.charInfo[e])
      .flatMap((char) =>
        this.words.filter((word) => word.at(this.rule.headIdx)! === char)
      );
  }

  getReachableRouteChars(char: Char) {
    const chanVisited = new Set();
    const wordVisited = new Set();

    const dfs = (char: Char) => {
      chanVisited.add(char);
      const nextWords = this.chanGraph
        .successors(char)
        .filter((e: Char) => !wordVisited.has(e));

      for (let next of nextWords) {
        wordVisited.add(next);
        const nextChans = this.wordGraph
          .successors(next)
          .filter((e) => !chanVisited.has(e));
        for (let nextChan of nextChans) {
          dfs(nextChan);
        }
      }
    };

    dfs(char);

    return [chanVisited, wordVisited];
  }

  // getShortestPaths(char: Char) {
  //   const result: Record<Char, { pathStart?: Word; length?: number }> = {};
  //   const visited: Record<Char, boolean> = {};

  //   for (let char of Object.keys(this.charInfo)) {
  //     result[char] = {};
  //     visited[char] = false;
  //   }
  //   const queue = new Collections.Queue<string>();
  //   result[char].length = 0;
  //   result[char].pathStart = undefined;
  //   visited[char] = true;
  //   // console.log(this.charInfo[char]);
  //   for (let word of this.charInfo[char].outWords.filter(
  //     (e) => !this.charInfo[char].returnWords!.has(e)
  //   )) {
  //     const nextChar = word.at(this.rule.tailIdx)!;

  //     if (result[nextChar].length === undefined) {
  //       visited[nextChar] = true;
  //       queue.enqueue(nextChar);
  //       result[nextChar].length = 1;
  //       result[nextChar].pathStart = word;
  //     }
  //   }

  //   // bfs
  //   while (!queue.isEmpty()) {
  //     const curr = queue.dequeue()!;

  //     const nextChars = new Set(
  //       this.charInfo[curr].outWords
  //         .filter((e) => !this.charInfo[char].returnWords!.has(e))
  //         .map((e: Word) => e.at(this.rule.tailIdx)!)
  //         .filter((e: Char) => !visited[e])
  //     );

  //     for (let next of nextChars) {
  //       visited[next] = true;
  //       queue.enqueue(next);
  //       result[next].length = result[curr].length! + 1;
  //       result[next].pathStart = result[curr].pathStart;
  //     }
  //   }

  //   return result;
  // }

  copy(except?: string[]): WCEngine {
    const engine = new WCEngine(this.rule, this.words);

    if (except && except.length > 0) {
      engine.words = this.words!.filter((e) => !except.includes(e));
      engine.charInfo = {};
      engine.update();
    } else {
      engine.charInfo = this.charInfo;
      engine.wordGraph = this.wordGraph;
      engine.chanGraph = this.chanGraph;
      engine.returnWordGraph = this.returnWordGraph;
      engine.loopWordGraph = this.loopWordGraph;
      engine.solutionGraph = this.solutionGraph;
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

export class WCDisplay {
  static routeCharTypeChartData(engine: WCEngine) {
    const routeChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "route"
    );
    const scc = engine.getSCC();
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
    const winChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "win"
    );
    const wincirChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "wincir"
    );

    const win: Record<string, string[]> = {};
    for (let char of winChars) {
      pushObject(win, engine.charInfo[char].endNum!, char);
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
    const losChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "los"
    );
    const loscirChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "loscir"
    );

    const los: Record<string, string[]> = {};
    for (let char of losChars) {
      pushObject(los, engine.charInfo[char].endNum!, char);
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
    const routeChars = Object.keys(engine.charInfo).filter(
      (e) => engine.charInfo[e].type === "route"
    ).length;
    const routeWords = engine.words
      .filter(
        (word) =>
          engine.charInfo[word.at(engine.rule.headIdx)!].type === "route" &&
          engine.charInfo[word.at(engine.rule.tailIdx)!].type === "route"
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
    const chars = Object.keys(engine.charInfo);

    const chartData = [
      {
        type: "win",

        num: chars.filter(
          (e) =>
            engine.charInfo[e].type === "win" ||
            engine.charInfo[e].type === "wincir"
        ).length,
        fill: "hsl(var(--win))",
      },

      {
        type: "los",
        num: chars.filter(
          (e) =>
            engine.charInfo[e].type === "los" ||
            engine.charInfo[e].type === "loscir"
        ).length,
        fill: "hsl(var(--los))",
      },
      {
        type: "route",
        num: chars.filter((e) => engine.charInfo[e].type === "route").length,
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
    const chars = Object.keys(engine.charInfo);
    chars.sort();

    for (let char of chars) {
      switch (engine.charInfo[char].type) {
        case "win":
          pushObject(win, engine.charInfo[char].endNum!, char);
          break;
        case "los":
          pushObject(los, engine.charInfo[char].endNum!, char);
          break;
        case "wincir":
          result.wincir.push(char);
          break;
        case "loscir":
          result.loscir.push(char);
          break;
      }
    }

    const SCC = engine.getSCC();
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

  // wordType : win, los, wincir, loscir, route, return, return
  static getWordType(
    engine: WCEngine,
    word: Word
  ): { type: string; endNum?: number } {
    const head = word.at(engine.rule.headIdx)!;
    const tail = word.at(engine.rule.tailIdx)!;

    if (engine.charInfo[head].type === "win") {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum! };
      } else if (engine.charInfo[tail].type === "los") {
        return { type: "win", endNum: engine.charInfo[tail].endNum! };
      } else if (engine.charInfo[tail].type === "wincir") {
        return { type: "loscir" };
      } else if (engine.charInfo[tail].type === "loscir") {
        return { type: "wincir" };
      } else {
        return { type: "route" };
      }
    } else if (engine.charInfo[head].type === "los") {
      return { type: "los", endNum: engine.charInfo[tail].endNum! };
    } else if (engine.charInfo[head].type === "wincir") {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum! };
      } else if (engine.solutionGraph.hasEdge(head, tail)) {
        return { type: "wincir" };
      } else if (engine.charInfo[tail].type === "wincir") {
        return { type: "loscir" };
      } else {
        return { type: "route" };
      }
    } else if (engine.charInfo[head].type === "loscir") {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum };
      } else {
        return { type: "loscir" };
      }
    } else {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum };
      } else if (engine.charInfo[tail].type === "wincir") {
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
      const chanSucc = new Set(
        changeableMap[engine.rule.changeableIdx](input).filter(
          (e) => e in engine.charInfo
        )
      );
      const chanPred = new Set(
        reverseChangeableMap[engine.rule.changeableIdx](input).filter(
          (e) => e in engine.charInfo
        )
      );
      const nextWords = engine.words.filter((e) =>
        chanSucc.has(e.at(engine.rule.headIdx)!)
      );
      const prevWords = engine.words.filter((e) =>
        chanPred.has(e.at(engine.rule.tailIdx)!)
      );
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

      const returnWords = { ...engine.returnWordGraph._succ[input] };

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
        switch (engine.charInfo[word.at(engine.rule.headIdx)!].type) {
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
}

export class RouteAnalyzer {
  rootEngine: WCEngine;
  currChar: Char;

  constructor(engine: WCEngine, char: Char) {
    this.currChar = char;

    this.rootEngine = this.getReducedEngine(engine, char);
    console.log(this.getReducedEngine(engine, char));
  }

  getReducedEngine(engine: WCEngine, char: Char) {
    const [chanChars, wordChars] = engine.getReachableRouteChars(char);

    const words = engine.words.filter(
      (word) =>
        wordChars.has(word.at(engine.rule.headIdx)!) &&
        chanChars.has(word.at(engine.rule.tailIdx)!)
    );

    const result = new WCEngine(engine.rule, words);
    result.update();
    return result;
  }

  getPriorities(engine: WCEngine, char: string) {
    const result: Record<Word, number> = {};

    for (let word of engine.charInfo[char].outWords) {
      result[word] = Infinity;
    }

    const paths = engine.getShortestPaths(char);

    for (let goal of Object.keys(engine.charInfo)) {
      if (paths[goal].pathStart) {
        const value =
          engine.charInfo[goal].outWords.filter(
            (e) =>
              !engine.charInfo[goal].returnWords?.has(e) &&
              !engine.charInfo[goal].loopWords?.has(e)
          ).length + paths[goal].length!;

        if (result[paths[goal].pathStart] > value) {
          result[paths[goal].pathStart] = value;
        }
      }
    }
    return result;
  }
  isWin(engine: WCEngine, char: string) {
    if (!engine.charInfo[char]) {
      console.log(engine, char);
    }
    if (
      engine.charInfo[char].type === "win" ||
      engine.charInfo[char].type === "wincir"
    ) {
      return true;
    } else if (
      engine.charInfo[char].type === "los" ||
      engine.charInfo[char].type === "loscir"
    ) {
      return false;
    }
    const priorities = this.getPriorities(engine, char);
    const nexts = Object.keys(priorities).sort(
      (a, b) => priorities[a] - priorities[b]
    );
    // console.log(nexts);
    for (let next of nexts) {
      // console.log(next);
      const nextEngine = this.getReducedEngine(
        engine.copy([next]).update(),
        next.at(engine.rule.tailIdx)!
      );
      // console.log(nextEngine.words);
      if (!this.isWin(nextEngine, next.at(engine.rule.tailIdx)!)) {
        return true;
      }
      console.log(nextEngine, next);
    }
    return false;
  }
}

export function objToInstance(obj: WCEngine): WCEngine {
  const result = new WCEngine(obj.rule, obj.words);
  result.wordGraph = objToMultiDiGraph(obj.wordGraph);
  result.chanGraph = objToMultiDiGraph(obj.chanGraph);
  result.returnWordGraph = objToMultiDiGraph(obj.returnWordGraph);
  result.loopWordGraph = objToMultiDiGraph(obj.loopWordGraph);
  result.solutionGraph = objToMultiDiGraph(obj.solutionGraph);
  result.charInfo = obj.charInfo;
  return result;
}
