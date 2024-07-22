import * as Collections from "typescript-collections";
import { changeableMap, reverseChangeableMap } from "./hangul";
import { pushObject } from "../utils";
export type WCRule = {
  changeableIdx: number;
  headIdx: number;
  tailIdx: number;
  manner: boolean;
};

export type Char = string;
export type CharType = "los" | "win" | "loscir" | "wincir" | "route";
export type WordType =
  | "win"
  | "los"
  | "wincir"
  | "loscir"
  | "route"
  | "route_return"
  | "loscir_return";
export type Word = string;

export class WCEngine {
  rule: WCRule;
  words: Word[];
  charInfo: {
    [char: Char]: {
      outWords: Word[];
      inWords: Word[];
      chanSucc: Char[];
      chanPred: Char[];
      type?: CharType;

      endNum?: number; // WIN, LOS일 때

      loopWords?: Set<Word>; // WINCIR, LOSCIR일 때
      returnWords?: Set<Word>; // WINCIR, LOSCIR일 때
      path?: Set<Word>; // WINCIR, LOSCIR일 때
      solution?: Word; // WINCIR, LOSCIR일 때
      winCirWords?: Word[]; // WINCIR, LOSCIR일 때
      losCirWords?: Word[];
    };
  };
  SCC?: Char[][];

  constructor(rule: WCRule, words?: Word[]) {
    this.rule = rule;
    this.words = words ? words : [];
    this.charInfo = {};
  }
  _setKeys(char: string) {
    if (!this.charInfo[char]) {
      this.charInfo[char] = {
        outWords: [],
        inWords: [],
        type: undefined,
        endNum: undefined,
        chanPred: [],
        chanSucc: [],
      };
    }
  }
  update() {
    for (let word of this.words) {
      let head = word.at(this.rule.headIdx) as string;
      let tail = word.at(this.rule.tailIdx) as string;
      this._setKeys(head);
      this._setKeys(tail);
    }
    // changeable
    for (let char in this.charInfo) {
      this.charInfo[char].chanSucc = changeableMap[this.rule.changeableIdx](
        char
      ).filter((e) => e in this.charInfo);
      this.charInfo[char].chanPred = reverseChangeableMap[
        this.rule.changeableIdx
      ](char).filter((e) => e in this.charInfo);
    }

    // chanPred, chanSucc, outWords, inWords
    for (let word of this.words) {
      let head = word.at(this.rule.headIdx)!;
      let headChangable = this.charInfo[head].chanPred!;

      let tail = word.at(this.rule.tailIdx)!;
      let tailChangable = this.charInfo[tail].chanSucc!;

      for (let headChan of headChangable) {
        this.charInfo[headChan].outWords!.push(word);
      }
      for (let tailChan of tailChangable) {
        this.charInfo[tailChan].inWords!.push(word);
      }
    }

    // WIN, LOS 분류
    this._sortChars();
    this._sortCirChars();
  }

  _sortChars() {
    // init counter
    const counter: Record<Char, number> = {};
    for (let char in this.charInfo) {
      counter[char] = this.charInfo[char].outWords.length;
    }

    // init pred
    const pred: Record<Char, Record<Char, number>> = {};
    for (let char in this.charInfo) {
      pred[char] = {};
    }
    for (let word of this.words) {
      const head = word.at(this.rule.headIdx)!;
      const headChangable = this.charInfo[head].chanPred!;
      const tail = word.at(this.rule.tailIdx)!;
      for (let headChan of headChangable) {
        if (!pred[tail][headChan]) {
          pred[tail][headChan] = 0;
        }
        pred[tail][headChan]++;
      }
    }

    // init queue
    const q: Collections.Queue<string> = new Collections.Queue();

    // find seeds
    for (let char in counter) {
      if (counter[char] === 0) {
        this.charInfo[char].type = "los";
        this.charInfo[char].endNum = 0;
        q.enqueue(char);
      }
    }

    // 분류
    while (!q.isEmpty()) {
      const losChar = q.dequeue()!;
      for (let winChar in pred[losChar]) {
        if (this.charInfo[winChar].type !== undefined) {
          continue;
        }
        this.charInfo[winChar].type = "win";
        this.charInfo[winChar].endNum = this.charInfo[losChar].endNum;

        for (let losCandidateChar in pred[winChar]) {
          counter[losCandidateChar] -= pred[winChar][losCandidateChar];

          if (counter[losCandidateChar] === 0) {
            this.charInfo[losCandidateChar].type = "los";
            this.charInfo[losCandidateChar].endNum =
              this.charInfo[losChar].endNum! + 1;
            q.enqueue(losCandidateChar);
          }
        }
      }
    }
  }

  _sortCirChars() {
    const cirChars: Char[] = Object.keys(this.charInfo).filter(
      (char) => this.charInfo[char].type === undefined
    );
    const cirWords: Word[] = this.words.filter(
      (word) =>
        !this.charInfo[word.at(this.rule.headIdx)!].type &&
        !this.charInfo[word.at(this.rule.tailIdx)!].type
    );

    // .outCirWords
    const outCirWords: Record<Char, Word[]> = cirChars.reduce(
      (acc: Record<Char, Word[]>, curr) => ((acc[curr] = []), acc),
      {}
    );
    for (let char of cirChars) {
      outCirWords[char] = this.charInfo[char].outWords.filter(
        (word) => !this.charInfo[word.at(this.rule.tailIdx)!].type
      );
    }

    let updatedChars: string[] = [];

    // console.log("시드 분류중")
    // .loopWords .returnWords .path
    for (let cirChar of cirChars) {
      this.charInfo[cirChar].loopWords = new Set<string>();
      this.charInfo[cirChar].returnWords = new Set<string>();
      this.charInfo[cirChar].path = new Set<string>();
    }
    for (let cirChar of cirChars) {
      for (let cirWord of outCirWords[cirChar]) {
        if (
          this.charInfo[cirChar].chanSucc!.includes(
            cirWord.at(this.rule.tailIdx)!
          )
        ) {
          this.charInfo[cirChar].loopWords!.add(cirWord);
          continue;
        }
        let reverseChan = this.charInfo[cirChar].chanPred!;
        if (
          reverseChan.includes(cirWord.at(this.rule.tailIdx)!) &&
          outCirWords[cirWord.at(this.rule.tailIdx)!].length ===
            outCirWords[cirChar].length
        ) {
          this.charInfo[cirChar].loopWords!.add(cirWord);
          continue;
        }
        for (let next_next of outCirWords[cirWord.at(this.rule.tailIdx)!]) {
          if (this.charInfo[cirChar].returnWords!.has(next_next)) {
            continue;
          }
          if (this.charInfo[cirChar].chanSucc!.includes(next_next)) {
            this.charInfo[cirChar].returnWords!.add(cirWord);
            this.charInfo[cirChar].returnWords!.add(next_next);
            break;
          }

          // this.charInfo[cirChar].chanPred.flatMap(this.charInfo[cirChar].changable.includes(this.rule.tail(next_next)))
          if (
            this.charInfo[cirChar]
              .chanSucc!.flatMap((e) => this.charInfo[e].chanPred)
              .includes(next_next.at(this.rule.tailIdx)!) &&
            outCirWords[next_next.at(this.rule.tailIdx)!].length ===
              outCirWords[cirChar]!.length
          ) {
            this.charInfo[cirChar].returnWords!.add(cirWord);
            this.charInfo[cirChar].returnWords!.add(next_next);
            break;
          }
        }
      }
    }

    // cirPred
    const cirPred: Record<Char, Set<Char>> = cirChars.reduce(
      (acc: Record<Char, Set<Char>>, curr) => ((acc[curr] = new Set()), acc),
      {}
    );

    for (let cirWord of cirWords) {
      let head = cirWord.at(this.rule.headIdx)!;

      let headChangable = this.charInfo[head].chanPred!;
      let tail = cirWord.at(this.rule.tailIdx)!;

      for (let headChan of headChangable.filter(
        (e) => !this.charInfo[e].type
      )) {
        cirPred[tail]!.add(headChan);
      }
    }

    // .sorted, .path
    for (let cirChar of cirChars) {
      let returnWordsNum = this.charInfo[cirChar].returnWords!.size / 2;
      let loopWordsNum = this.charInfo[cirChar].loopWords!.size;
      let outCirWordsNum = outCirWords[cirChar].length;

      if (returnWordsNum + loopWordsNum !== outCirWordsNum) {
        continue;
      }
      if (loopWordsNum % 2 === 1) {
        this.charInfo[cirChar].solution = [
          ...this.charInfo[cirChar].loopWords!,
        ][0];
        this.charInfo[cirChar].type = "wincir";
      } else {
        this.charInfo[cirChar].type = "loscir";
      }
      updatedChars.push(cirChar);
      this.charInfo[cirChar].path = this.charInfo[cirChar].returnWords!;
    }
    // console.log("시드 분류 완료")

    // .CIRWIN, .CIRLOS
    // console.log("CIRWIN, CIRLOS 분류 중")

    let i = 0;
    while (updatedChars.length !== 0) {
      i++;
      // console.log("깊이 : " + i)

      let newUpdatedChars = [];
      let predecessors: Set<string> = new Set();
      for (let char of updatedChars) {
        for (let cirChar of cirPred[char]!) {
          if (this.charInfo[cirChar].type) {
            continue;
          }
          predecessors.add(cirChar);
        }
      }

      for (let char of predecessors) {
        for (let next of outCirWords[char]!) {
          let nextPath = this.charInfo[next.at(this.rule.tailIdx)!].path;

          if (
            this.charInfo[next.at(this.rule.tailIdx)!].type === "loscir" &&
            !nextPath!.has(next)
          ) {
            this.charInfo[char].type = "wincir";
            newUpdatedChars.push(char);
            this.charInfo[char].path = new Set([...nextPath!, next]);
            if (!this.charInfo[char].winCirWords) {
              this.charInfo[char].winCirWords = [];
            }
            this.charInfo[char].winCirWords!.push(next);
            this.charInfo[char].solution = next;

            break;
          }
        }
      }

      for (let char of newUpdatedChars) {
        for (let cirChar of cirPred[char]!) {
          if (this.charInfo[cirChar].type) {
            continue;
          }
          predecessors.add(cirChar);
        }
      }

      for (let char of predecessors) {
        let lose = true;
        let path = new Set<string>();

        for (let next of outCirWords[char]!) {
          let nextPath = this.charInfo[next.at(this.rule.tailIdx)!].path;
          if (this.charInfo[char].loopWords!.has(next)) {
            continue;
          }
          if (this.charInfo[char].returnWords!.has(next)) {
            continue;
          }
          if (
            !(
              this.charInfo[next.at(this.rule.tailIdx)!].type === "wincir" &&
              !nextPath!.has(next)
            )
          ) {
            lose = false;
            break;
          } else {
            path = new Set([
              ...nextPath!,
              ...this.charInfo[char].returnWords!,
              next,
              ...path,
            ]);
          }
        }

        if (lose) {
          this.charInfo[char].path = path;
          if (this.charInfo[char].loopWords!.size % 2 === 0) {
            this.charInfo[char].type = "loscir";
          } else {
            this.charInfo[char].solution = [
              ...this.charInfo[char].loopWords!,
            ][0];
            this.charInfo[char].type = "wincir";
          }
          newUpdatedChars.push(char);
        }
      }

      updatedChars = newUpdatedChars;
    }

    for (let char of cirChars) {
      // .losCirWords
      if (!this.charInfo[char].type || this.charInfo[char].type === "wincir") {
        for (let next of outCirWords[char]!) {
          let nextPath = this.charInfo[next.at(this.rule.tailIdx)!].path;

          if (
            this.charInfo[next.at(this.rule.tailIdx)!].type === "wincir" &&
            !nextPath!.has(next)
          ) {
            if (!this.charInfo[char].losCirWords) {
              this.charInfo[char].losCirWords = [];
            }
            this.charInfo[char].losCirWords!.push(next);
          }
        }
      }
      // .winCirWords
      if (this.charInfo[char].type === "wincir") {
        for (let next of outCirWords[char]) {
          let nextPath = this.charInfo[next.at(this.rule.tailIdx)!].path;
          if (
            this.charInfo[next.at(this.rule.tailIdx)!].type === "loscir" &&
            !nextPath!.has(next)
          ) {
            if (!this.charInfo[char].winCirWords) {
              this.charInfo[char].winCirWords = [];
            }
            this.charInfo[char].winCirWords!.push(next);
          }
        }
      }
    }
    for (let char of cirChars) {
      if (this.charInfo[char].type === undefined)
        this.charInfo[char].type = "route";
    }
  }

  sortRouteChars() {
    const routeChars: Char[] = Object.keys(this.charInfo).filter(
      (char) => this.charInfo[char].type === "route"
    );
    const routeWords = this.words.filter(
      (word) =>
        this.charInfo[word.at(this.rule.headIdx)!].type === "route" &&
        this.charInfo[word.at(this.rule.tailIdx)!].type === "route"
    );

    const graph: Record<Char, Set<Char>> = routeChars.reduce(
      (acc: Record<Char, Set<Char>>, curr) => ((acc[curr] = new Set()), acc),
      {}
    );

    for (let char of routeChars) {
      for (let chan of this.charInfo[char].chanPred) {
        if (this.charInfo[chan].type === "route") graph[char].add(chan);
      }
      for (let chan of this.charInfo[char].chanSucc) {
        if (this.charInfo[chan].type === "route") graph[char].add(chan);
      }
    }
    for (let word of routeWords) {
      const head = word.at(this.rule.headIdx)!;
      const tail = word.at(this.rule.tailIdx)!;
      graph[head].add(tail);
    }

    let id = 0;
    const d: Record<Char, number> = routeChars.reduce(
      (acc: Record<Char, number>, curr) => ((acc[curr] = 0), acc),
      {}
    );

    const finished: Record<Char, boolean> = routeChars.reduce(
      (acc: Record<Char, boolean>, curr) => ((acc[curr] = false), acc),
      {}
    );

    const SCC: Char[][] = [];
    const stack: Char[] = [];

    const dfs: (x: Char) => number = (x: Char) => {
      d[x] = ++id;
      stack.push(x);

      let parent = d[x];
      const succ = [...graph[x]];
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

    for (let char of routeChars) {
      if (d[char] === 0) {
        dfs(char);
      }
    }
    this.SCC = SCC;
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
    loscir_return: Word[];
    route_return: Word[];
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
        num: chars.filter((e) => engine.charInfo[e].type === "win").length,
        fill: "hsl(var(--win))",
      },
      {
        type: "wincir",
        num: chars.filter((e) => engine.charInfo[e].type === "wincir").length,
        fill: "hsl(var(--win) / 0.6)",
      },
      {
        type: "los",
        num: chars.filter((e) => engine.charInfo[e].type === "los").length,
        fill: "hsl(var(--los))",
      },
      {
        type: "loscir",
        num: chars.filter((e) => engine.charInfo[e].type === "loscir").length,
        fill: "hsl(var(--los) / 0.6)",
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

    for (let scc of engine.SCC!) {
      scc.sort();
    }
    result.route = engine.SCC!.sort((a, b) =>
      b.length === a.length ? (a[0] > b[0] ? 1 : -1) : b.length - a.length
    );

    result.win = Object.keys(win)
      .map((e) => parseInt(e))
      .sort()
      .map((endNum) => ({ endNum, chars: win[endNum] }));

    result.los = Object.keys(los)
      .map((e) => parseInt(e))
      .sort()
      .reverse()
      .map((endNum) => ({ endNum, chars: los[endNum] }));

    return result;
  }

  // wordType : win, los, wincir, loscir, route, route_return,loscir_return
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
      return { type: "los", endNum: engine.charInfo[head].endNum! };
    } else if (engine.charInfo[head].type === "wincir") {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum! };
      } else if (
        engine.charInfo[head].winCirWords &&
        engine.charInfo[head].winCirWords!.includes(word)
      ) {
        return { type: "wincir" };
      } else if (
        !engine.charInfo[head].winCirWords &&
        engine.charInfo[head].loopWords!.has(word)
      ) {
        return { type: "wincir" };
      } else if (engine.charInfo[head].returnWords!.has(word)) {
        return { type: "route_return" };
      } else if (
        engine.charInfo[head].losCirWords &&
        engine.charInfo[head].losCirWords!.includes(word)
      ) {
        return { type: "loscir" };
      } else {
        return { type: "route" };
      }
    } else if (engine.charInfo[head].type === "loscir") {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum };
      } else if (engine.charInfo[head].returnWords!.has(word)) {
        return { type: "loscir_return" };
      } else {
        return { type: "loscir" };
      }
    } else {
      if (engine.charInfo[tail].type === "win") {
        return { type: "los", endNum: engine.charInfo[tail].endNum };
      } else if (
        engine.charInfo[head].losCirWords &&
        engine.charInfo[head].losCirWords!.includes(word)
      ) {
        return { type: "loscir" };
      } else if (engine.charInfo[head].returnWords!.has(word)) {
        return { type: "route_return" };
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
      if (!engine.charInfo[input]) {
        return undefined;
      }
      const result: CharSearchResult = {
        startsWith: {
          win: [],
          los: [],
          wincir: [],
          loscir: [],
          route: [],
          loscir_return: [],
          route_return: [],
        },
        endsWith: {
          head_los: [],
          head_route: [],
          rest: [],
        },
      };
      const startWin: Record<string, Word[]> = {};
      const startLos: Record<string, Word[]> = {};

      const startWords = engine.charInfo[input].outWords.sort((a, b) =>
        WCDisplay.compareWord(engine, a, b)
      );
      const endWords = engine.charInfo[input].inWords.sort((a, b) =>
        WCDisplay.compareWord(engine, a, b)
      );

      for (let word of startWords) {
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
        .sort()
        .map((endNum) => ({ endNum, words: startWin[endNum] }));

      result.startsWith.los = Object.keys(startLos)
        .map((e) => parseInt(e))
        .sort()
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
      case "loscir_return":
        return "los";
      case "route":
      case "route_return":
        return "route";
    }
  }
}

class StrategyTree {
  constructor() {}
}
