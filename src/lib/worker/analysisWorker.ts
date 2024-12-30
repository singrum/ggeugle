import {
  getReachableNodes,
  isWin,
  iterativeDeepeningSearch,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";
import { MultiDiGraph, objToMultiDiGraph } from "../wc/multidigraph";
import { Char } from "../wc/WordChain";

export type payload = {
  action: "startAnalysis" | "IDS:startAnalysis";
  data: unknown;
};

const analysis = ({
  namedRule,
  withStack,
  chanGraph,
  wordGraph,
  startChar,
  exceptWord,
}: {
  namedRule: string;
  withStack: boolean;
  chanGraph: MultiDiGraph;
  wordGraph: MultiDiGraph;
  startChar: Char;
  exceptWord?: Char[];
}) => {
  chanGraph = objToMultiDiGraph(chanGraph);
  wordGraph = objToMultiDiGraph(wordGraph);
  if (exceptWord) {
    if (wordGraph.nodes[exceptWord[0]].loop === exceptWord[1]) {
      wordGraph.nodes[exceptWord[0]].loop = undefined;
    } else {
      wordGraph.removeEdge(exceptWord[0], exceptWord[1], 1);
    }
  }

  const reacheable = getReachableNodes(chanGraph, wordGraph, startChar);

  chanGraph = chanGraph.getSubgraph(reacheable);
  wordGraph = wordGraph.getSubgraph(reacheable);
  chanGraph.clearNodeInfo();
  wordGraph.clearNodeInfo();
  pruningWinLos(chanGraph, wordGraph);
  pruningWinLosCir(chanGraph, wordGraph);

  const wordStack: Char[][] = [];
  const maxBranch: (Char[][] | undefined)[] = [];

  const win = withStack
    ? isWin(
        namedRule,
        chanGraph,
        wordGraph,
        startChar,
        (head, tail) => {
          wordStack.push([head!, tail!]);
          self.postMessage({ action: "stackChange", data: wordStack });
        },
        (win) => {
          const word = wordStack.pop()!;

          if (win) {
            const branch = (maxBranch[wordStack.length + 1] || []).concat([
              word,
            ]);
            maxBranch[wordStack.length + 1] = undefined;
            maxBranch[wordStack.length] = branch;
          } else {
            const branch = (maxBranch[wordStack.length + 1] || []).concat([
              word,
            ]);
            maxBranch[wordStack.length + 1] = undefined;
            if (
              !maxBranch[wordStack.length] ||
              maxBranch[wordStack.length]!.length < branch.length
            ) {
              maxBranch[wordStack.length] = branch;
            }
          }

          self.postMessage({ action: "stackChange", data: wordStack });
        }
      )
    : isWin(namedRule, chanGraph, wordGraph, startChar);

  self.postMessage({
    action: "end",
    data: {
      word: exceptWord,
      maxStack: (maxBranch[0] || []).reverse(),
      win,
    },
  });
};

const IDSAnalysis = ({
  withStack,
  chanGraph,
  wordGraph,
  startChar,
}: {
  withStack: boolean;
  chanGraph: MultiDiGraph;
  wordGraph: MultiDiGraph;
  startChar: Char;
}) => {
  chanGraph = objToMultiDiGraph(chanGraph);
  wordGraph = objToMultiDiGraph(wordGraph);

  const reacheable = getReachableNodes(chanGraph, wordGraph, startChar);

  chanGraph = chanGraph.getSubgraph(reacheable);
  wordGraph = wordGraph.getSubgraph(reacheable);
  chanGraph.clearNodeInfo();
  wordGraph.clearNodeInfo();
  pruningWinLos(chanGraph, wordGraph);
  pruningWinLosCir(chanGraph, wordGraph);

  const wordStack: Char[][] = [];
  const maxBranch: (Char[][] | undefined)[] = [];

  const win = withStack
    ? iterativeDeepeningSearch(
        chanGraph,
        wordGraph,
        startChar,
        (action: string, data?: any) => {
          if (action === "pop") {
            const word = wordStack.pop()!;
            // data === "cutoff" 추가해야 하나? 잘 모르겠음

            if (data === true) {
              const branch = (maxBranch[wordStack.length + 1] || []).concat([
                word,
              ]);
              maxBranch[wordStack.length + 1] = undefined;
              maxBranch[wordStack.length] = branch;
            } else {
              const branch = (maxBranch[wordStack.length + 1] || []).concat([
                word,
              ]);
              maxBranch[wordStack.length + 1] = undefined;
              if (
                !maxBranch[wordStack.length] ||
                maxBranch[wordStack.length]!.length < branch.length
              ) {
                maxBranch[wordStack.length] = branch;
              }
            }

            self.postMessage({ action: "IDS:pop" });
          } else if (action === "push") {
            wordStack.push(data);
            self.postMessage({ action: "IDS:push", data });
          } else if (action === "newDepth") {
            wordStack.length = 0;
            maxBranch.length = 0;
            self.postMessage({ action: "IDS:newDepth", data });
          }
        }
      )
    : iterativeDeepeningSearch(chanGraph, wordGraph, startChar);

  self.postMessage({
    action: "IDS:end",
    data: {
      maxStack: (maxBranch[0] || []).reverse(),
      win,
    },
  });
};

self.onmessage = (event) => {
  const { action, data }: payload = event.data;

  switch (action) {
    case "startAnalysis":
      analysis(
        data as {
          namedRule: string;
          withStack: boolean;
          chanGraph: MultiDiGraph;
          wordGraph: MultiDiGraph;
          startChar: Char;
          exceptWord: Char[];
        }
      );
      return;
    case "IDS:startAnalysis":
      IDSAnalysis(
        data as {
          withStack: boolean;
          chanGraph: MultiDiGraph;
          wordGraph: MultiDiGraph;
          startChar: Char;
        }
      );
      return;
  }
};
