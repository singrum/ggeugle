import * as Collections from "typescript-collections";
import { changeableMap, reverseChangeableMap } from "./hangul";
import { arrayToKeyMap, pushObject } from "../utils";
import { indexOf } from "typescript-collections/dist/lib/arrays";
import { MultiDiGraph, objToMultiDiGraph } from "./multidigraph";
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
  loopWordGraph: MultiDiGraph;
  solutionGraph: MultiDiGraph;
  charInfo: Record<Char, { type: CharType; endNum?: number }>;

  constructor(rule: WCRule, words?: Word[]) {
    this.rule = rule;
    this.words = words ? words : [];
    this.wordGraph = new MultiDiGraph();
    this.returnWordGraph = new MultiDiGraph();
    this.loopWordGraph = new MultiDiGraph();
    this.solutionGraph = new MultiDiGraph();
    this.chanGraph = new MultiDiGraph();
    this.charInfo = {};
  }

  update() {
    for (let word of this.words) {
      let head = word.at(this.rule.headIdx) as string;
      let tail = word.at(this.rule.tailIdx) as string;
      this.wordGraph.addEdge(head, tail);
    }
    // this.charInfo = arrayToKeyMap([...this.wordGraph.nodes], () => ({}));

    for (let char of this.wordGraph.nodes) {
      changeableMap[this.rule.changeableIdx](char)
        .filter((e) => this.wordGraph.nodes.has(e))
        .forEach((chan) => this.chanGraph.addEdge(char, chan));
    }

    // WIN, LOS 분류
    this._sortChars();
    this._sortCirChars();
    return this;
  }

  _sortChars() {
    let i = 0;
    const chars = [...this.chanGraph.nodes];

    // 시드 찾기 wordSinks, chanSinks
    let wordLos: Char[] = chars.filter(
      (e) => this.wordGraph.successors(e).length === 0
    );
    this.chanGraph.removeInEdge(wordLos);

    let chanLos: Char[] = chars.filter(
      (e) => this.chanGraph.successors(e).length === 0
    );
    this.chanGraph.removeNode(chanLos);
    let info = {
      type: "los" as CharType,
      endNum: i,
    };
    for (let char of chanLos) {
      this.charInfo[char] = info;
    }

    // win, los 분류
    while (chanLos.length !== 0) {
      const wordWins: Char[] = this.wordGraph.predecessors(chanLos);
      this.wordGraph.removeNode(chanLos);

      const chanWins: Char[] = this.chanGraph.predecessors(wordWins);
      this.chanGraph.removeNode(wordWins);
      info = { type: "win" as CharType, endNum: i };
      for (let char of chanWins) {
        this.charInfo[char] = info;
      }

      i++;

      let preds = this.wordGraph.predecessors(chanWins);

      this.wordGraph.removeNode(chanWins);
      this.chanGraph.removeNode(chanWins);

      wordLos = preds.filter(
        (pred) =>
          this.wordGraph.nodes.has(pred) &&
          this.wordGraph.successors(pred).length === 0
      );

      preds = this.chanGraph.predecessors(wordLos);
      this.chanGraph.removeInEdge(wordLos);
      chanLos = preds.filter((e) => this.chanGraph.successors(e).length === 0);
      this.chanGraph.removeNode(chanLos);
      info = { type: "los", endNum: i };
      for (let char of chanLos) {
        this.charInfo[char] = info;
      }
    }
  }

  _sortCirChars() {
    // 돌림 단어쌍 찾기
    const pair: (head: string, tail: string) => undefined | [string, string] = (
      head: string,
      tail: string
    ) => {
      for (let headPred of this.chanGraph.predecessors(head)) {
        for (let tailSucc of this.chanGraph.successors(tail)) {
          if (this.wordGraph.hasEdge(tailSucc, headPred)) {
            return [tailSucc, headPred];
          }
        }
      }
      return undefined;
    };

    const chars = [...this.wordGraph.nodes];

    const singleCharCounter = arrayToKeyMap(
      chars,
      (e: string) => this.chanGraph.predecessors(e).length
    );
    for (let char of chars) {
      if (this.chanGraph.successors(char).length === 1) {
        singleCharCounter[this.chanGraph.successors(char)[0]]--;
      }
    }

    for (let head of this.wordGraph.nodes) {
      for (let tail of this.wordGraph.successors(head)) {
        const returnPair = pair(head, tail);
        if (
          !returnPair ||
          singleCharCounter[head] !== 0 ||
          singleCharCounter[returnPair[0]] !== 0
        )
          continue;
        const [pairHead, pairTail] = returnPair;
        // 맴맴, 삐삐, 죽력죽
        if (pairHead === head) {
          const outdeg = this.wordGraph._succ[head][tail];
          const maximumEven = Math.floor(outdeg / 2) * 2;
          if (maximumEven > 0) {
            this.returnWordGraph.addEdge(head, tail, maximumEven);
          }
          if (outdeg % 2 === 1) {
            this.loopWordGraph.addEdge(head, tail);
          }
        }
        // 늠축 - 축보름
        else {
          this.returnWordGraph.addEdge(
            head,
            tail,
            Math.min(
              this.wordGraph._succ[head][tail],
              this.wordGraph._succ[pairHead][pairTail]
            )
          );
        }
      }
    }
    // this.wordGraph에서 제거
    for (let head of this.returnWordGraph.nodes) {
      for (let tail of this.returnWordGraph.successors(head)) {
        this.wordGraph.removeEdge(
          head,
          tail,
          this.returnWordGraph._succ[head][tail]
        );
      }
    }
    const hasLoop = arrayToKeyMap(
      chars,
      (char) =>
        this.loopWordGraph.nodes.has(char) &&
        this.loopWordGraph.successors(char).length > 0
    );

    // loop 제거
    for (let head of this.loopWordGraph.nodes) {
      for (let tail of this.loopWordGraph.successors(head)) {
        this.wordGraph.removeEdge(
          head,
          tail,
          this.loopWordGraph._succ[head][tail]
        );
      }
    }

    let i = 0;
    let wordSinks = chars.filter(
      (e) => this.wordGraph.successors(e).length === 0
    );
    let wordWin = wordSinks.filter((e) => hasLoop[e]);
    wordWin.forEach((char) => {
      this.solutionGraph.addEdge(
        char,
        char,
        this.loopWordGraph._succ[char][char]
      );
    });

    let wordLos = wordSinks.filter((e) => !hasLoop[e]);

    let chanWin = this.chanGraph.predecessors(wordWin);
    this.chanGraph.removeNode(chanWin);
    let info = { type: "wincir" as CharType, endNum: i };
    chanWin.forEach((char) => {
      this.charInfo[char] = info;
    });

    this.chanGraph.removeInEdge(wordLos);

    let chanLos = [...this.chanGraph.nodes].filter(
      (e) => this.chanGraph.successors(e).length === 0
    );
    info = { type: "loscir" as CharType, endNum: i };
    chanLos.forEach((char) => {
      this.charInfo[char] = info;
    });

    this.chanGraph.removeNode(chanLos);

    while (chanLos.length > 0 || chanWin.length > 0) {
      // console.log(chanLos, chanWin);

      let preds = this.wordGraph.predecessors(chanWin);
      this.wordGraph.removeNode(chanWin);
      this.chanGraph.removeNode(chanWin);

      wordSinks = preds.filter(
        (e) =>
          this.wordGraph.nodes.has(e) &&
          this.wordGraph.successors(e).length === 0
      );

      wordLos = wordSinks.filter((e) => !hasLoop[e]);
      const wordWinLoop = wordSinks.filter((e) => hasLoop[e]);
      wordWinLoop.forEach((char) => {
        this.solutionGraph.addEdge(
          char,
          char,
          this.loopWordGraph._succ[char][char]
        );
      });
      const wordWinNoLoop = [];
      for (let char of chanLos) {
        const preds = this.wordGraph.predecessors(char);

        preds.forEach((pred) =>
          this.solutionGraph.addEdge(
            pred,
            char,
            this.wordGraph._succ[pred][char]
          )
        );
        wordWinNoLoop.push(...preds);
      }

      wordWin = [...wordWinLoop, ...wordWinNoLoop];
      this.wordGraph.removeNode(chanLos);

      chanWin = this.chanGraph.predecessors(wordWin);
      this.chanGraph.removeNode(chanWin);

      preds = this.chanGraph.predecessors(wordLos);
      this.chanGraph.removeInEdge(wordLos);
      chanLos = preds.filter((e) => this.chanGraph.successors(e).length === 0);
      this.chanGraph.removeNode(chanLos);
      i++;

      info = { type: "loscir", endNum: i };
      chanLos.forEach((char) => {
        this.charInfo[char] = info;
      });
      info = { type: "wincir", endNum: i };
      chanWin.forEach((char) => (this.charInfo[char] = info));
    }
    [...this.chanGraph.nodes].forEach((char) => {
      this.charInfo[char] = { type: "route" };
    });
    return;
  }

  getSCC() {
    const chars = [...this.chanGraph.nodes];
    let id = 0;

    const d: Record<Char, number> = arrayToKeyMap(chars, () => 0);

    const finished: Record<Char, boolean> = arrayToKeyMap(chars, () => false);

    const SCC: Char[][] = [];
    const stack: Char[] = [];

    const dfs: (x: Char) => number = (x: Char) => {
      d[x] = ++id;
      stack.push(x);

      let parent = d[x];
      const succ = [
        ...new Set(
          (this.chanGraph.nodes.has(x)
            ? this.chanGraph.successors(x)
            : []
          ).concat(
            this.chanGraph.nodes.has(x) ? this.wordGraph.successors(x) : []
          )
        ),
      ];
      for (let i = 0; i < succ.length; i++) {
        const next = succ[i];

        if (d[next] === 0) parent = Math.min(parent, dfs(next));
        else if (!finished[next]) parent = Math.min(parent, d[next]);
      }

      if (parent === d[x]) {
        const scc: Char[] = [];
        while (1) {
          const t = stack.pop()!;
          scc.push(t);
          finished[t] = true;
          if (t === x) break;
        }

        SCC.push(scc);
      }

      return parent;
    };

    for (let char of chars) {
      if (d[char] === 0) {
        dfs(char);
      }
    }

    return SCC;
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
