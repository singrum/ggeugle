import { arraysEqual, arrayToKeyMap } from "../utils";
import { chundoPrecedence, precedenceMap } from "./analysisPrecedence";
import { MultiDiGraph } from "./multidigraph";
import { Char } from "./WordChain";

export function pruningWinLos(
  chanGraph: MultiDiGraph,
  wordGraph: MultiDiGraph
) {
  const wordLos = Object.keys(wordGraph.nodes).filter(
    (e) => wordGraph.successors(e).length === 0
  );

  wordLos.forEach((e) => {
    wordGraph.nodes[e].type = "los";
    wordGraph.nodes[e].endNum = 0;
  });

  chanGraph.removeInEdge(wordLos);

  let chanLos = Object.keys(chanGraph.nodes).filter(
    (e) => chanGraph.successors(e).length === 0
  );

  chanLos.forEach((e) => {
    chanGraph.nodes[e].type = "los";
    chanGraph.nodes[e].endNum = 0;
  });

  while (true) {
    const wordWin: Char[] = [];
    for (const cl of chanLos) {
      const preds = wordGraph.predecessors(cl);
      preds.forEach((e) => {
        wordWin.push(e);
        wordGraph.nodes[e].solution = cl;
        wordGraph.nodes[e].type = "win";
        wordGraph.nodes[e].endNum = (chanGraph.nodes[cl].endNum as number) + 1;
        wordGraph.removeOutEdge(e);
      });
    }

    if (wordWin.length === 0) break;

    const chanWin: Char[] = [];

    for (const ww of wordWin) {
      const preds = chanGraph.predecessors(ww);
      preds.forEach((e) => {
        chanWin.push(e);
        chanGraph.nodes[e].solution = ww;
        chanGraph.nodes[e].type = "win";
        chanGraph.nodes[e].endNum = wordGraph.nodes[ww].endNum;
        chanGraph.removeOutEdge(e);
      });
    }

    if (chanWin.length === 0) break;
    chanGraph.removeOutEdge(chanWin);

    wordGraph.forEachPreds(chanWin, (node, pred) => {
      wordGraph.nodes[pred].endNum =
        (chanGraph.nodes[node].endNum as number) + 1;
    });
    const wordLosCandidates = wordGraph.predecessors(chanWin);
    wordGraph.removeInEdge(chanWin);
    const wordLos = wordLosCandidates.filter(
      (e) => wordGraph.successors(e).length === 0
    );
    if (wordLos.length === 0) break;

    wordLos.forEach((e) => {
      wordGraph.nodes[e].type = "los";
    });
    const chanLosCandidates = chanGraph.predecessors(wordLos);
    chanGraph.forEachPreds(wordLos, (node, pred) => {
      chanGraph.nodes[pred].endNum = wordGraph.nodes[node].endNum;
    });
    chanGraph.removeInEdge(wordLos);
    chanLos = chanLosCandidates.filter(
      (e) => chanGraph.successors(e).length === 0
    );

    if (chanLos.length === 0) break;
    chanLos.forEach((e) => {
      chanGraph.nodes[e].type = "los";
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

  // const singleChars: Set<string> = new Set(getSingleChars(chanGraph));

  const returnWordGraph = new MultiDiGraph();

  for (let head of chars) {
    for (let tail of wordGraph.successors(head)) {
      if (returnWordGraph.hasEdge(head, tail)) {
        continue;
      }

      const returnPair = pair(head, tail);

      if (!returnPair) continue;
      const [pairHead, pairTail] = returnPair;
      //      래내 래1내 내이 이래
      const pairTailSucc = chanGraph
        .successors(pairTail)
        .filter((e) => wordGraph.successors(e).length > 0);
      const tailSucc = chanGraph
        .successors(tail)
        .filter((e) => wordGraph.successors(e).length > 0);

      if (
        !chanGraph
          .predecessors(head)
          .every((e) => pairTailSucc.every((ts) => chanGraph.hasEdge(e, ts)))
      )
        continue;
      if (
        !chanGraph
          .predecessors(pairHead)
          .every((e) => tailSucc.every((ts) => chanGraph.hasEdge(e, ts)))
      )
        continue;
      if (pairHead === head) {
        // 맴맴, 삐삐, 죽력죽
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
        const pairMin = Math.min(
          wordGraph._succ[head][tail],
          wordGraph._succ[pairHead][pairTail]
        );
        returnWordGraph.addEdge(head, tail, pairMin);
        returnWordGraph.addEdge(pairHead, pairTail, pairMin);
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
    wordGraph.nodes[char].endNum =
      wordGraph.nodes[char].endNum === undefined
        ? 1
        : (wordGraph.nodes[char].endNum as number) + 1;
    wordGraph.nodes[char].type = "wincir";
  });

  wordLos.forEach((char) => {
    wordGraph.nodes[char].endNum =
      wordGraph.nodes[char].endNum === undefined
        ? 0
        : wordGraph.nodes[char].endNum;
    wordGraph.nodes[char].type = "loscir";
  });

  let chanWin: string[] = [];

  chanGraph.forEachPreds(wordWin, (node, pred) => {
    chanWin.push(pred);
    chanGraph.nodes[pred].endNum = wordGraph.nodes[node].endNum;
    chanGraph.nodes[pred].type = "wincir";
    chanGraph.nodes[pred].solution = node;
  });

  chanGraph.removeOutEdge(chanWin);

  chanGraph.forEachPreds(wordLos, (node, pred) => {
    chanGraph.nodes[pred].endNum = wordGraph.nodes[node].endNum as number;
  });
  chanGraph.removeInEdge(wordLos);

  let chanLos = Object.keys(chanGraph.nodes).filter(
    (e) => !chanGraph.nodes[e].type && chanGraph.successors(e).length === 0
  );

  chanLos.forEach((char) => {
    chanGraph.nodes[char].type = "loscir";
    if (chanGraph.nodes[char].endNum === undefined)
      chanGraph.nodes[char].endNum = 0;
  });

  while (chanLos.length > 0 || chanWin.length > 0) {
    let preds = wordGraph.predecessors(chanWin);
    wordGraph.forEachPreds(chanWin, (node, pred) => {
      wordGraph.nodes[pred].endNum =
        (chanGraph.nodes[node].endNum as number) + 1;
    });
    wordGraph.removeInEdge(chanWin);

    wordSinks = preds.filter((e) => wordGraph.successors(e).length === 0);
    wordLos = wordSinks.filter((e) => !wordGraph.nodes[e].loop);

    wordLos.forEach((char) => {
      wordGraph.nodes[char].type = "loscir";
    });

    const wordWinLoop = wordSinks.filter((e) => wordGraph.nodes[e].loop);
    wordWinLoop.forEach((e) => {
      wordGraph.nodes[e].endNum = (wordGraph.nodes[e].endNum as number) + 1;
      wordGraph.nodes[e].type = "wincir";
      wordGraph.nodes[e].solution = wordGraph.nodes[e].loop;
    });
    const wordWinNoLoop = [];
    for (let char of chanLos) {
      const preds = wordGraph.predecessors(char);
      preds.forEach((pred) => {
        wordGraph.nodes[pred].endNum =
          (chanGraph.nodes[char].endNum as number) + 1;
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
      chanGraph.nodes[pred].endNum = wordGraph.nodes[node].endNum;
      chanGraph.nodes[pred].type = "wincir";
      chanGraph.nodes[pred].solution = node;
    });

    chanGraph.removeOutEdge(chanWin);

    preds = chanGraph.predecessors(wordLos);
    chanGraph.forEachPreds(wordLos, (node, pred) => {
      chanGraph.nodes[pred].endNum = wordGraph.nodes[node].endNum;
    });
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
  isChundo: boolean,
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

  nextWords.sort((a, b) => nextWordSortKey(a, b, isGuel, isChundo));

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
      isChundo,
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
  let depth = 1;

  while (1) {
    if (callback) callback("newDepth", depth);
    const result = depthLimitedSearch(
      chanGraph,
      wordGraph,
      currChar,
      depth,
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
      callback
    );

    if (callback) {
      callback("pop", !win);
    }
    if (win === false) {
      return true;
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

export function nextWordSortKey(
  a: {
    word: Char[];
    isLoop: boolean;
    moveNum?: number;
  },
  b: {
    word: Char[];
    isLoop: boolean;
    moveNum?: number;
  },
  isGuel: boolean,
  isChundo: boolean
) {
  let a_key, b_key;

  if (isGuel && precedenceMap[a.word[0]]?.[a.word[1]]) {
    a_key = -precedenceMap[a.word[0]][a.word[1]];
  } else if (isChundo && chundoPrecedence[a.word[1]]) {
    a_key = -chundoPrecedence[a.word[1]];
  } else {
    a_key = a.moveNum;
  }
  if (isGuel && precedenceMap[b.word[0]]?.[b.word[1]]) {
    b_key = -precedenceMap[b.word[0]][b.word[1]];
  } else if (isChundo && chundoPrecedence[b.word[1]]) {
    b_key = -chundoPrecedence[b.word[1]];
  } else {
    b_key = b.moveNum;
  }
  // console.log(a_key, b_key);
  //균권,권벽,벽읍,읍륵,륵흔,흔굉,굉확,확견,견융,융준,준축,축융

  return a_key! - b_key!;
}
