import {
  getNextWords,
  getReachableNodes,
  isWin,
  pruningWinLos,
  pruningWinLosCir,
} from "../wc/algorithms";
import {
  MultiDiGraph,
  objToMultiDiGraph,
  ObjToWordMap,
  WordMap,
} from "../wc/multidigraph";
import { Char, objToInstance, TreeData, WCEngine, Word } from "../wc/wordChain";

export type payload = {
  action: "startAnalysis";
  data: unknown;
};

const analysis = ({
  chanGraph,
  wordGraph,
  startChar,
  exceptWord,
}: {
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

  const winWord = isWin(
    chanGraph,
    wordGraph,
    startChar,
    (head, tail) => {
      wordStack.push([head!, tail!]);
      self.postMessage({ action: "stackChange", data: wordStack });
    },
    () => {
      wordStack.pop();
      self.postMessage({ action: "stackChange", data: wordStack });
    }
  );
  //승리
  if (winWord) {
    self.postMessage({
      action: "end",
      data: {
        win: true,
      },
    });
  }
  //패배
  else {
    self.postMessage({
      action: "end",
      data: {
        // treeData,
        win: false,
      },
    });
  }
};

self.onmessage = (event) => {
  const { action, data }: payload = event.data;

  switch (action) {
    case "startAnalysis":
      analysis(
        data as {
          chanGraph: MultiDiGraph;
          wordGraph: MultiDiGraph;
          startChar: Char;
          exceptWord: Char[];
        }
      );
      return;
  }
};
