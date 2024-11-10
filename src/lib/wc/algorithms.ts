import { arraysEqual, arrayToKeyMap } from "../utils";
import { precedenceMap } from "./analysisPrecedence";
import { MultiDiGraph } from "./multidigraph";
import { Char } from "./WordChain";

export function pruningWinLos(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph
) {
  let endNum = 0;

  const wordLos = Object.keys(wordGraph.nodes).filter(
    (e) => wordGraph.successors(e).length === 0
  );

  wordLos.forEach((e) => {
    wordGraph.nodes[e].type = "los";
    wordGraph.nodes[e].endNum = endNum;
  });

  chanGraph.removeInEdge(wordLos);

  let chanLos = Object.keys(chanGraph.nodes).filter(
    (e) => chanGraph.successors(e).length === 0
  );

  chanLos.forEach((e) => {
    chanGraph.nodes[e].type = "los";
    chanGraph.nodes[e].endNum = endNum;
  });

  while (true) {
    const wordWinSet: Set<string> = new Set();
    for (const cl of chanLos) {
      const preds = wordGraph.predecessors(cl);
      preds.forEach((e) => {
        wordWinSet.add(e);
        wordGraph.nodes[e].solution = cl;

        wordGraph.nodes[e].type = "win";
        wordGraph.nodes[e].endNum = endNum;
      });
    }
    const wordWin = [...wordWinSet];
    if (wordWin.length === 0) break;
    wordGraph.removeOutEdge(wordWin);

    const chanWinSet: Set<string> = new Set();

    for (const ww of wordWin) {
      const preds = chanGraph.predecessors(ww);
      preds.forEach((e) => {
        chanWinSet.add(e);
        chanGraph.nodes[e].solution = ww;
        chanGraph.nodes[e].type = "win";
        chanGraph.nodes[e].endNum = endNum;
      });
    }
    const chanWin = [...chanWinSet];

    if (chanWin.length === 0) break;
    chanGraph.removeOutEdge(chanWin);

    endNum++;

    const wordLosCandidates = wordGraph.predecessors(chanWin);
    wordGraph.removeInEdge(chanWin);

    const wordLos = wordLosCandidates.filter(
      (e) => wordGraph.successors(e).length === 0
    );
    if (wordLos.length === 0) break;

    wordLos.forEach((e) => {
      wordGraph.nodes[e].type = "los";
      wordGraph.nodes[e].endNum = endNum;
    });

    const chanLosCandidates = chanGraph.predecessors(wordLos);
    chanGraph.removeInEdge(wordLos);
    chanLos = chanLosCandidates.filter(
      (e) => chanGraph.successors(e).length === 0
    );

    if (chanLos.length === 0) break;
    chanLos.forEach((e) => {
      chanGraph.nodes[e].type = "los";
      chanGraph.nodes[e].endNum = endNum;
    });
  }
  return;
}

export function getSingleChars(chanGraph: MultiDiGraph) {
  const chars = Object.keys(chanGraph.nodes).filter(
    (e) => !chanGraph.nodes[e].type
  );
  return chars.filter((char) => {
    const temp = chanGraph
      .predecessors(char)
      .map((pred) =>
        chanGraph.successors(pred).filter((e) => !chanGraph.nodes[e].type)
      )
      .sort();
    return temp.every((arr) => arraysEqual(arr, temp[0]));
  });
}

export function pruningWinLosCir(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph
) {
  const pair: (head: string, tail: string) => undefined | [string, string] = (
    head: string,
    tail: string
  ) => {
    for (let headPred of chanGraph.predecessors(head)) {
      for (let tailSucc of chanGraph.successors(tail)) {
        if (wordGraph.hasEdge(tailSucc, headPred)) {
          return [tailSucc, headPred];
        }
      }
    }
    return undefined;
  };

  const chars = Object.keys(wordGraph.nodes).filter(
    (e) => !wordGraph.nodes[e].type
  );

  const singleChars: Set<string> = new Set(getSingleChars(chanGraph));

  const returnWordGraph = new MultiDiGraph();

  for (let head of chars) {
    for (let tail of wordGraph.successors(head)) {
      const returnPair = pair(head, tail);

      if (
        !returnPair ||
        !singleChars.has(head) ||
        !singleChars.has(returnPair[0])
      )
        continue;
      const [pairHead, pairTail] = returnPair;
      // 맴맴, 삐삐, 죽력죽
      if (pairHead === head) {
        const outdeg = wordGraph._succ[head][tail];
        const maximumEven = Math.floor(outdeg / 2) * 2;
        if (maximumEven > 0) {
          returnWordGraph.addEdge(head, tail, maximumEven);
        }
        if (outdeg % 2 === 1) {
          if (
            chanGraph
              .predecessors(head)
              .every((e) => chanGraph.successors(e).length === 1)
          ) {
            wordGraph.nodes[head].loop = tail;
          }
        }
      }
      // 늠축 - 축보름
      else {
        returnWordGraph.addEdge(
          head,
          tail,
          Math.min(
            wordGraph._succ[head][tail],
            wordGraph._succ[pairHead][pairTail]
          )
        );
      }
    }
  }

  // this.wordGraph에서 제거

  for (let head in returnWordGraph.nodes) {
    for (let tail of returnWordGraph.successors(head)) {
      wordGraph.removeEdge(head, tail, returnWordGraph._succ[head][tail]);
    }
  }

  // loop 제거
  for (let head of chars) {
    if (wordGraph.nodes[head].loop) {
      wordGraph.removeEdge(head, wordGraph.nodes[head].loop as string);
    }
  }

  let wordSinks = chars.filter((e) => wordGraph.successors(e).length === 0);
  let wordWin = wordSinks.filter((e) => wordGraph.nodes[e].loop);
  let wordLos = wordSinks.filter((e) => !wordGraph.nodes[e].loop);

  wordWin.forEach((char) => {
    wordGraph.nodes[char].solution = wordGraph.nodes[char].loop;
    wordGraph.nodes[char].type = "wincir";
  });
  wordLos.forEach((char) => {
    wordGraph.nodes[char].type = "loscir";
  });

  let chanWin: string[] = [];

  chanGraph.forEachPreds(wordWin, (node, pred) => {
    chanWin.push(pred);
    chanGraph.nodes[pred].type = "wincir";
    chanGraph.nodes[pred].solution = node;
  });

  chanGraph.removeOutEdge(chanWin);

  chanGraph.removeInEdge(wordLos);
  let chanLos = Object.keys(chanGraph.nodes).filter(
    (e) => !chanGraph.nodes[e].type && chanGraph.successors(e).length === 0
  );

  chanLos.forEach((char) => {
    chanGraph.nodes[char].type = "loscir";
  });

  while (chanLos.length > 0 || chanWin.length > 0) {
    let preds = wordGraph.predecessors(chanWin);
    wordGraph.removeInEdge(chanWin);

    wordSinks = preds.filter((e) => wordGraph.successors(e).length === 0);
    wordLos = wordSinks.filter((e) => !wordGraph.nodes[e].loop);
    wordLos.forEach((char) => {
      wordGraph.nodes[char].type = "loscir";
    });

    const wordWinLoop = wordSinks.filter((e) => wordGraph.nodes[e].loop);
    wordWinLoop.forEach((e) => {
      wordGraph.nodes[e].type = "wincir";
      wordGraph.nodes[e].solution = wordGraph.nodes[e].loop;
    });
    const wordWinNoLoop = [];
    for (let char of chanLos) {
      const preds = wordGraph.predecessors(char);
      preds.forEach((pred) => {
        wordGraph.nodes[pred].type = "wincir";
        wordGraph.nodes[pred].solution = char;
      });
      wordGraph.removeOutEdge(preds);
      wordWinNoLoop.push(...preds);
    }
    wordWin = [...wordWinLoop, ...wordWinNoLoop];

    chanWin = [];
    chanGraph.forEachPreds(wordWin, (node, pred) => {
      chanWin.push(pred);
      chanGraph.nodes[pred].type = "wincir";
      chanGraph.nodes[pred].solution = node;
    });

    chanGraph.removeOutEdge(chanWin);

    preds = chanGraph.predecessors(wordLos);
    chanGraph.removeInEdge(wordLos);
    chanLos = preds.filter((e) => chanGraph.successors(e).length === 0);

    chanLos.forEach((e) => {
      chanGraph.nodes[e].type = "loscir";
    });
  }
  for (let char in chanGraph.nodes) {
    if (!chanGraph.nodes[char].type) {
      chanGraph.nodes[char].type = "route";
    }
  }
  for (let char in wordGraph.nodes) {
    if (!wordGraph.nodes[char].type) {
      wordGraph.nodes[char].type = "route";
    }
  }
  return returnWordGraph;
}

export function getSCC(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  seeds: string[]
) {
  let id = 0;
  const seedSet = new Set(seeds);
  const d: Record<Char, number> = arrayToKeyMap(seeds, () => 0);

  const finished: Record<Char, boolean> = arrayToKeyMap(seeds, () => false);

  const SCC: Char[][] = [];
  const stack: Char[] = [];

  const dfs: (x: Char) => number = (x: Char) => {
    d[x] = ++id;
    stack.push(x);

    let parent = d[x];
    const succ = [
      ...new Set(
        (chanGraph.nodes[x] ? chanGraph.successors(x) : []).concat(
          chanGraph.nodes[x] ? wordGraph.successors(x) : []
        )
      ),
    ].filter((e) => seedSet.has(e));
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

  for (let char of seeds) {
    if (d[char] === 0) {
      dfs(char);
    }
  }

  return SCC;
}

export function getMaxMinComponents(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  seeds: string[]
) {
  const scc = getSCC(chanGraph, wordGraph, seeds);
  const maxComp = scc.filter((e) => e.length >= 3).flat();
  const minComp = scc.filter((e) => e.length < 3).flat();

  return [maxComp, minComp];
}

export function getReachableNodes(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  char: string
) {
  const chanVisited: Set<string> = new Set();
  const wordVisited: Set<string> = new Set();

  const dfs = (char: string) => {
    chanVisited.add(char);
    const nextWords = chanGraph.successors(char);
    nextWords.forEach((char) => wordVisited.add(char));

    const nextChans = nextWords
      .flatMap((e) => [
        ...wordGraph.successors(e),
        ...(wordGraph.nodes[e].loop ? [wordGraph.nodes[e].loop as string] : []),
      ])
      .filter((e) => !chanVisited.has(e));

    for (let next of nextChans) {
      dfs(next);
    }
  };

  dfs(char);

  return new Set([...chanVisited, ...wordVisited]);
}

export function getNextWords(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  currChar: Char,
  withMoveNum?: boolean
) {
  const chanSucc = chanGraph.successors(currChar);
  const nextWords: {
    word: Char[];
    isLoop: boolean;
    moveNum?: number;
  }[] = [];

  for (let chan of chanSucc) {
    for (let word of wordGraph.successors(chan)) {
      const nextWordInfo: {
        word: Char[];
        isLoop: boolean;

        moveNum?: number;
      } = {
        word: [chan, word],
        isLoop: false,
      };

      if (withMoveNum) {
        nextWordInfo.moveNum = getNextWords(chanGraph, wordGraph, word).length;
      }
      nextWords.push(nextWordInfo);
    }
    if (wordGraph.nodes[chan].loop) {
      const nextWordInfo: {
        word: Char[];
        isLoop: boolean;
        moveNum?: number;
      } = {
        word: [chan, wordGraph.nodes[chan].loop as Char],
        isLoop: true,
      };
      if (withMoveNum) {
        nextWordInfo.moveNum = getNextWords(
          chanGraph,
          wordGraph,
          wordGraph.nodes[chan].loop as string
        ).length;
      }
      nextWords.push(nextWordInfo);
    }
  }

  return nextWords;
}

export function isWin(
  isGuel: boolean,
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  currChar: Char,
  pushCallback?: (head?: Char, tail?: Char) => void,
  popCallback?: (win: boolean) => void
) {
  if (
    chanGraph.nodes[currChar].type === "win" ||
    chanGraph.nodes[currChar].type === "wincir"
  ) {
    return true;
  }
  if (
    chanGraph.nodes[currChar].type === "los" ||
    chanGraph.nodes[currChar].type === "loscir"
  ) {
    return false;
  }

  const nextWords = getNextWords(chanGraph, wordGraph, currChar, true);

  nextWords.sort((a, b) => {
    if (isGuel && precedenceMap[a.word[0]] === a.word[1]) {
      return -1;
    }
    if (isGuel && precedenceMap[b.word[0]] === b.word[1]) {
      return 1;
    }
    return a.moveNum! - b.moveNum!;
  });

  for (let { word, isLoop } of nextWords) {
    const nextChanGraph = chanGraph.copy();
    const nextWordGraph = wordGraph.copy();
    // 단어 삭제
    if (pushCallback) {
      pushCallback(word[0], word[1]);
    }
    if (isLoop) {
      nextWordGraph.nodes[word[0]].loop = undefined;
    } else {
      nextWordGraph.removeEdge(word[0], word[1], 1);
    }
    nextWordGraph.clearNodeInfo();
    nextChanGraph.clearNodeInfo();
    pruningWinLos(nextChanGraph, nextWordGraph);
    pruningWinLosCir(nextChanGraph, nextWordGraph);

    const win = isWin(
      isGuel,
      nextChanGraph,
      nextWordGraph,
      word[1],
      pushCallback,
      popCallback
    );
    if (popCallback) {
      popCallback(!win);
    }
    if (!win) {
      return true;
    }
  }

  return false;
}

export function iterativeDeepeningSearch(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  currChar: Char,
  callback?: (action: string, data?: any) => void
) {
  let depth = 24;

  while (1) {
    if (callback) callback("newDepth", depth);
    const result = depthLimitedSearch(
      chanGraph,
      wordGraph,
      currChar,
      depth,
      undefined,
      callback
    );

    if (result !== "cutoff") {
      return result;
    } else {
      if (callback) callback("cutoff");
    }
    depth++;
  }
}

function depthLimitedSearch(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph,
  currChar: Char,
  depth: number,
  firstBranch: Char[] | undefined,
  callback?: (action: string, data?: any) => void
) {
  if (
    chanGraph.nodes[currChar].type === "win" ||
    chanGraph.nodes[currChar].type === "wincir"
  ) {
    return true;
  }
  if (
    chanGraph.nodes[currChar].type === "los" ||
    chanGraph.nodes[currChar].type === "loscir"
  ) {
    return false;
  }
  if (depth === 0) {
    return "cutoff";
  }

  const nextWords = getNextWords(chanGraph, wordGraph, currChar, true);

  nextWords.sort((a, b) => {
    return a.moveNum! - b.moveNum!;
  });

  let isChildCutoff = false;

  for (let { word, isLoop } of nextWords) {
    if (callback) {
      callback("push", word);
    }
    const nextChanGraph = chanGraph.copy();
    const nextWordGraph = wordGraph.copy();

    if (isLoop) {
      nextWordGraph.nodes[word[0]].loop = undefined;
    } else {
      nextWordGraph.removeEdge(word[0], word[1], 1);
    }
    nextWordGraph.clearNodeInfo();
    nextChanGraph.clearNodeInfo();
    pruningWinLos(nextChanGraph, nextWordGraph);
    pruningWinLosCir(nextChanGraph, nextWordGraph);

    const win = depthLimitedSearch(
      nextChanGraph,
      nextWordGraph,
      word[1],
      depth - 1,
      firstBranch ? word : firstBranch,
      callback
    );

    if (callback) {
      callback("pop");
    }
    if (win === false) {
      return firstBranch === undefined ? firstBranch : true;
    }
    if (win === "cutoff") {
      isChildCutoff = true;
    }
  }

  if (isChildCutoff) {
    return "cutoff";
  } else {
    return false;
  }
}
