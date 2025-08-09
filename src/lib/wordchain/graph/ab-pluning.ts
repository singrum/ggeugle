// 간단한 게임 트리용 alphabeta pruning 구현 예제

import type { BipartiteDiGraph } from "./bipartite-digraph";
import type { NodeName } from "./graph";

type Node = [BipartiteDiGraph, [NodeName, NodeName]];

export function alphabeta(
  node: Node, // 노드 (게임 상태 또는 트리 노드)
  depth: number, // 탐색 깊이 제한
  alpha: number, // 알파 값 (최대 플레이어가 확보한 최고 점수)
  beta: number, // 베타 값 (최소 플레이어가 확보한 최저 점수)
  maximizingPlayer: boolean, // 현재 플레이어가 최대 플레이어인가?
  evaluate: (node: Node) => number,
  getChildren: (node: Node) => Node[],
): number {
  if (depth === 0) {
    return evaluate(node); // 리프 노드면 평가 함수 반환
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const child of getChildren(node)) {
      const evalScore = alphabeta(
        child,
        depth - 1,
        alpha,
        beta,
        false,
        evaluate,
        getChildren,
      );
      maxEval = Math.max(maxEval, evalScore);

      if (beta <= alpha) {
        break; // 베타 컷오프: 더 이상 탐색 안 함
      }
      alpha = Math.max(alpha, maxEval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const child of getChildren(node)) {
      const evalScore = alphabeta(
        child,
        depth - 1,
        alpha,
        beta,
        true,
        evaluate,
        getChildren,
      );
      minEval = Math.min(minEval, evalScore);

      if (beta <= alpha) {
        break; // 알파 컷오프
      }
      beta = Math.min(beta, minEval);
    }
    return minEval;
  }
}

// === helper 함수들 (사용하는 게임, 트리 구조에 맞게 구현 필요) ===

// === 사용 예시 ===
