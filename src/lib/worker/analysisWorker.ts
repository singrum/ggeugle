import {
  getReachableNodes,
  isWin,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";
import { MultiDiGraph, objToMultiDiGraph } from "../wc/multidigraph";
import { Char } from "../wc/WordChain";

export type payload = {
  action: "startAnalysis";
  data: unknown;
};

const analysis = ({
  withStack,
  chanGraph,
  wordGraph,
  startChar,
  exceptWord,
}: {
  withStack: boolean;
  chanGraph: MultiDiGraph;
  wordGraph: MultiDiGraph;
  startChar: Char;
  exceptWord: Char[];
}) => {
  chanGraph = objToMultiDiGraph(chanGraph);
  wordGraph = objToMultiDiGraph(wordGraph);

  if (wordGraph.nodes[exceptWord[0]].loop === exceptWord[1]) {
    wordGraph.nodes[exceptWord[0]].loop = undefined;
  } else {
    wordGraph.removeEdge(exceptWord[0], exceptWord[1], 1);
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
    : isWin(chanGraph, wordGraph, startChar);

  self.postMessage({
    action: "end",
    data: {
      word: exceptWord,
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
          withStack: boolean;
          chanGraph: MultiDiGraph;
          wordGraph: MultiDiGraph;
          startChar: Char;
          exceptWord: Char[];
        }
      );
      return;
  }
};
