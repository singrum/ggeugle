import { arrayToKeyMap } from "../utils";
import { MultiDiGraph } from "./multidigraph";
import { Char } from "./wordChain";

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
    const wordWin = wordGraph.predecessors(chanLos);
    if (wordWin.length === 0) break;
    wordWin.forEach((e) => {
      wordGraph.nodes[e].type = "win";
      wordGraph.nodes[e].endNum = endNum;
    });
    wordGraph.removeOutEdge(wordWin);
    const chanWin = chanGraph.predecessors(wordWin);
    if (chanWin.length === 0) break;
    chanWin.forEach((e) => {
      chanGraph.nodes[e].type = "win";
      chanGraph.nodes[e].endNum = endNum;
    });
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

  const singleCharCounter = arrayToKeyMap(
    Object.keys(chanGraph.nodes).filter((e) => !chanGraph.nodes[e].type),
    (e: string) => chanGraph.predecessors(e).length
  );

  for (let char in singleCharCounter) {
    if (
      chanGraph.successors(char).filter((e) => !chanGraph.nodes[e].type)
        .length === 1
    ) {
      singleCharCounter[chanGraph.successors(char)[0]]--;
    }
  }

  const returnWordGraph = new MultiDiGraph();

  // const solutionGraph = new MultiDiGraph();

  for (let head of chars) {
    for (let tail of wordGraph.successors(head)) {
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
        const outdeg = wordGraph._succ[head][tail];
        const maximumEven = Math.floor(outdeg / 2) * 2;
        if (maximumEven > 0) {
          returnWordGraph.addEdge(head, tail, maximumEven);
        }
        if (outdeg % 2 === 1) {
          wordGraph.nodes[head].loop = tail;
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
    wordGraph.nodes[char].type = "winlos";
  });

  let chanWin = chanGraph.predecessors(wordWin);
  chanGraph.removeOutEdge(chanWin);

  chanWin.forEach((char) => {
    chanGraph.nodes[char].type = "wincir";
  });
  // wordGraph.removeInEdge(chanWin);

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
      wordGraph.nodes[char].type = "winlos";
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

    chanWin = chanGraph.predecessors(wordWin);
    chanGraph.removeOutEdge(chanWin);

    preds = chanGraph.predecessors(wordLos);
    chanGraph.removeInEdge(wordLos);
    chanLos = preds.filter((e) => chanGraph.successors(e).length === 0);

    chanWin.forEach((e) => {
      chanGraph.nodes[e].type = "wincir";
    });
    chanLos.forEach((e) => {
      chanGraph.nodes[e].type = "loscir";
    });
  }
  // Object.keys(chanGraph).forEach((char) => {
  //   !chanGraph.nodes[char].type;
  // });
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
