import {
  getMaxTrail,
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
  isGuel,
  withStack,
  chanGraph,
  wordGraph,
  startChar,
  exceptWord,
}: {
  isGuel: boolean;
  withStack: boolean;
  chanGraph: MultiDiGraph;
  wordGraph: MultiDiGraph;
  startChar: Char;
  exceptWord: Char[];
}) => {
  chanGraph = objToMultiDiGraph(chanGraph);
  wordGraph = objToMultiDiGraph(wordGraph);

  let chanGraph_ = chanGraph.copy();
  let wordGraph_ = wordGraph.copy();

  if (wordGraph_.nodes[exceptWord[0]].loop === exceptWord[1]) {
    wordGraph_.nodes[exceptWord[0]].loop = undefined;
  } else {
    wordGraph_.removeEdge(exceptWord[0], exceptWord[1], 1);
  }

  const reacheable = getReachableNodes(chanGraph_, wordGraph_, startChar);

  chanGraph_ = chanGraph_.getSubgraph(reacheable);
  wordGraph_ = wordGraph_.getSubgraph(reacheable);
  chanGraph_.clearNodeInfo();
  wordGraph_.clearNodeInfo();
  pruningWinLos(chanGraph_, wordGraph_);
  pruningWinLosCir(chanGraph_, wordGraph_);

  const wordStack: Char[][] = [];
  const maxBranch: (Char[][] | undefined)[] = [];

  const win = withStack
    ? isWin(
        isGuel,
        chanGraph_,
        wordGraph_,
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
    : isWin(isGuel, chanGraph_, wordGraph_, startChar);
  // let maxStack;
  // if (withStack) {
  //   maxStack = [exceptWord, ...(maxBranch[0] || []).reverse()];
  //   console.log(maxStack);
  //   for (const word of maxStack) {
  //     if (wordGraph.nodes[word[0]].loop === word[1]) {
  //       wordGraph.nodes[word[0]].loop = undefined;
  //     } else {
  //       wordGraph.removeEdge(word[0], word[1], 1);
  //     }
  //   }
  //   wordGraph.clearNodeInfo();
  //   chanGraph.clearNodeInfo();
  //   pruningWinLos(chanGraph, wordGraph);
  //   pruningWinLosCir(chanGraph, wordGraph);

  //   console.log(getMaxTrail(chanGraph, wordGraph, maxStack.at(-1)![1]));
  // }
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
          isGuel: boolean;
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
