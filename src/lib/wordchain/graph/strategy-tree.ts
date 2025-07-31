// isWin === true
// winningPath | losingMoves
// 슐레지엔     | [엔드로핀, 엔담, 엔드밀, 엔비아르]
// 핀컬        | [컬렉션, 컬러텔레비전, 컬러판, 컬럼브석, 컬러]
// 션보롬      | x

// isWin === false
// winningPath | losingMoves
// 핀컬        | [엔드로핀, 엔담, 엔드밀, 엔비아르]
// 션보롬      | [컬렉션, 컬러텔레비전, 컬러판, 컬럼브석, 컬러]
import type { ChangeFunc } from "@/types/rule";
import type { TreeData } from "@/types/search";
import type { WordSolver } from "../word/word-solver";
import type { NodeName, NodePos } from "./graph";

export class StrategyTree<Move> {
  getWinningMove: (move: Move) => Move;
  getLosingMoves: (move: Move) => Move[];
  winningPath: Move[];
  losingMoves: { moves: Move[]; selectedIndex: number }[];
  isWin: boolean;
  constructor(
    root: { isWin: true; move: Move } | { isWin: false; moves: Move[] },
    getWinningMove: (move: Move) => Move,
    getLosingMoves: (move: Move) => Move[],
  ) {
    this.winningPath = [];
    this.losingMoves = [];
    this.isWin = root.isWin;
    this.getWinningMove = getWinningMove;
    this.getLosingMoves = getLosingMoves;
    if (root.isWin) {
      this.expandWinningMove(0, root.move);
    } else {
      this.expandLosingMove(0, root.moves);
    }
  }
  selectIndex(depth: number, index: number) {
    this.expandLosingMove(depth, this.losingMoves[depth].moves, index);
  }
  expandWinningMove(depth: number, move: Move) {
    this.winningPath.length = depth;
    this.winningPath.push(move);
    const moves = this.getLosingMoves(move);

    this.expandLosingMove(depth + 1 - Number(this.isWin), moves);
  }
  expandLosingMove(depth: number, moves: Move[], index: number = 0) {
    if (moves.length === 0) {
      return;
    }
    this.losingMoves.length = depth;
    this.losingMoves.push({ moves, selectedIndex: index });
    this.expandWinningMove(
      depth + Number(this.isWin),
      this.getWinningMove(moves[index]),
    );
  }
  getState() {
    const result: (
      | { isWin: true; move: Move; depth: number }
      | { isWin: false; moves: Move[]; selectedIndex: number; depth: number }
    )[] = [];

    if (this.isWin === true) {
      result.push({
        isWin: true,
        move: this.winningPath[0],
        depth: 0,
      });
      for (let i = 0; i < this.winningPath.length - 1; i++) {
        result.push({
          isWin: false,
          ...this.losingMoves[i],
          depth: i,
        });
        result.push({
          isWin: true,
          move: this.winningPath[i + 1],
          depth: i + 1,
        });
      }
    } else {
      for (let i = 0; i < this.winningPath.length; i++) {
        result.push({
          isWin: false,
          ...this.losingMoves[i],
          depth: i,
        });
        result.push({
          isWin: true,
          move: this.winningPath[i],
          depth: i,
        });
      }
    }

    return result;
  }
}

export class WcStrategyTree {
  tree: StrategyTree<[NodeName, NodeName]>;

  solver: WordSolver;

  constructor(
    solver: WordSolver,
    pos: NodePos,
    startNode: NodeName,
    changeFunc: ChangeFunc,
  ) {
    const nodeType = solver.graphSolver.getNodeType(startNode, pos, changeFunc);
    let root:
      | { isWin: true; move: [NodeName, NodeName] }
      | { isWin: false; moves: [NodeName, NodeName][] };

    if (nodeType === "route") {
      throw new Error("route node cannot make strategy tree");
    }
    if (nodeType === "win" || nodeType === "loopwin") {
      const move = solver.graphSolver.getWinningOptimalMove(
        pos,
        startNode,
        changeFunc,
      );

      root = { isWin: true, move: [move[0], move[1]] };
    } else {
      const moves = solver.graphSolver.graphs
        .getGraph("winlose")
        .getMovesFromNode(startNode, pos, 0, changeFunc)
        .map((e) => [e[0], e[1]] as [NodeName, NodeName])
        .sort((a, b) => {
          return (
            -solver.graphSolver.depthMap[0][a[1]]! +
            solver.graphSolver.depthMap[0][b[1]]!
          );
        });

      root = { isWin: false, moves: moves };
    }

    this.tree = new StrategyTree<[NodeName, NodeName]>(
      root,
      (move) =>
        solver.graphSolver.getWinningOptimalMove(0, move[1], changeFunc),
      (move) => {
        const moves = solver.graphSolver.graphs
          .getGraph("winlose")
          .getMovesFromNode(move[1], 0, 0, changeFunc)
          .filter(([start, end]) => {
            return end !== solver.graphSolver.loopMap[start];
          })
          .map((e) => [e[0], e[1]] as [NodeName, NodeName])
          .sort((a, b) => {
            return (
              -solver.graphSolver.depthMap[0][a[1]] +
              solver.graphSolver.depthMap[0][b[1]]
            );
          });

        return moves;
      },
    );

    this.solver = solver;
  }
  selectIndex(depth: number, index: number) {
    this.tree.selectIndex(depth, index);
  }
  getTreeData(): TreeData {
    const result: (
      | { isWin: true; move: NodeName[]; depth: number }
      | {
          isWin: false;
          moves: NodeName[][];
          selectedIndex: number;
          depth: number;
        }
    )[] = this.tree.getState();
    return result.map((e) => {
      if (e.isWin) {
        return {
          ...e,
          word: (this.solver.wordMap.get(e.move[0], e.move[1]) || []).slice(
            ...this.solver.graphSolver.graphs.getEdgeIdxRange(
              e.move[0],
              e.move[1],
              "winlose",
            ),
          ),
        } as { isWin: true; word: string[]; depth: number };
      } else {
        return {
          ...e,
          words: e.moves.map((move) => {
            return (this.solver.wordMap.get(move[0], move[1]) || []).slice(
              ...this.solver.graphSolver.graphs.getEdgeIdxRange(
                move[0],
                move[1],
                "winlose",
              ),
            );
          }),
        } as {
          isWin: false;
          words: string[][];
          selectedIndex: number;
          depth: number;
        };
      }
    });
  }
}
