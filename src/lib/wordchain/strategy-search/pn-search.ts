/**
 * 게임 트리의 각 노드를 나타내는 인터페이스.
 * 게임의 특정 상태를 의미합니다.
 */
interface GameNode {
  id: string; // 각 노드를 식별하기 위한 고유 ID
  isTerminal: boolean; // 게임이 끝나는 상태인지 여부
  outcome?: "WIN" | "LOSS" | "DRAW"; // 게임 결과 (터미널 노드일 경우)
  children: GameNode[]; // 자식 노드들 (다음 가능한 수들)
  isProvingPlayerTurn: boolean; // 현재 노드가 증명하려는 플레이어의 턴인지 여부 (AND/OR 노드 구분)
}

/**
 * 프루프 넘버 서치 알고리즘을 위한 노드
 */
class PNSNode {
  public proof: number = 1; // 프루프 넘버
  public disproof: number = 1; // 디스프루프 넘버
  public readonly state: GameNode; // 해당 노드의 게임 상태
  public parent?: PNSNode; // 부모 노드
  public children?: PNSNode[]; // 자식 노드 (탐색 시 생성됨)

  constructor(state: GameNode, parent?: PNSNode) {
    this.state = state;
    this.parent = parent;
    this.initializeProofNumbers();
  }

  /**
   * 노드의 프루프/디스프루프 넘버를 초기화합니다.
   */
  private initializeProofNumbers(): void {
    if (this.state.isTerminal) {
      if (this.state.outcome === "WIN") {
        this.proof = 0;
        this.disproof = Infinity; // 증명 불가
      } else {
        // LOSS 또는 DRAW
        this.proof = Infinity; // 증명 불가
        this.disproof = 0;
      }
    }
  }

  /**
   * 노드가 증명 또는 반증되었는지 확인합니다.
   */
  public isSolved(): boolean {
    return this.proof === 0 || this.disproof === 0;
  }
}

/**
 * 프루프 넘버 서치(PNS) 클래스
 */
export class ProofNumberSearch {
  private root: PNSNode;

  constructor(initialState: GameNode) {
    this.root = new PNSNode(initialState);
  }

  /**
   * 증명 탐색을 실행합니다.
   * @returns 탐색 결과 ('PROVEN' 또는 'DISPROVEN')
   */
  public runSearch(): "PROVEN" | "DISPROVEN" {
    while (!this.root.isSolved()) {
      // 1. 가장 유망한 노드를 찾음 (Most Promising Node)
      const currentNode = this.selectMostPromisingNode(this.root);

      // 2. 해당 노드를 확장 (자식 노드 생성)
      this.expandNode(currentNode);

      // 3. 확장된 노드부터 루트까지 프루프/디스프루프 넘버를 업데이트
      this.updateAncestors(currentNode);
    }

    return this.root.proof === 0 ? "PROVEN" : "DISPROVEN";
  }

  /**
   * 1. 루트부터 시작하여 가장 증명 가능성이 높은 노드를 선택합니다.
   */
  private selectMostPromisingNode(node: PNSNode): PNSNode {
    let currentNode = node;
    while (currentNode.children) {
      // 확장된 노드 중에서만 선택
      if (currentNode.state.isProvingPlayerTurn) {
        // AND 노드
        // 모든 자식을 증명해야 하므로, 디스프루프 넘버가 가장 작은 자식을 따라감
        let bestChild: PNSNode | null = null;
        for (const child of currentNode.children) {
          if (!bestChild || child.disproof < bestChild.disproof) {
            bestChild = child;
          }
        }
        currentNode = bestChild!;
      } else {
        // OR 노드
        // 하나의 자식만 증명하면 되므로, 프루프 넘버가 가장 작은 자식을 따라감
        let bestChild: PNSNode | null = null;
        for (const child of currentNode.children) {
          if (!bestChild || child.proof < bestChild.proof) {
            bestChild = child;
          }
        }
        currentNode = bestChild!;
      }
    }
    return currentNode;
  }

  /**
   * 2. 선택된 노드를 확장하여 자식 PNSNode들을 생성합니다.
   */
  private expandNode(node: PNSNode): void {
    if (node.isSolved()) return; // 이미 해결된 노드는 확장하지 않음

    node.children = node.state.children.map(
      (childState) => new PNSNode(childState, node),
    );
  }

  /**
   * 3. 노드와 그 조상들의 프루프/디스프루프 넘버를 업데이트합니다.
   */
  private updateAncestors(node: PNSNode): void {
    let currentNode: PNSNode | undefined = node;
    while (currentNode) {
      if (currentNode.isSolved()) {
        currentNode = currentNode.parent;
        continue;
      }

      if (currentNode.children) {
        // 자식이 있는 경우에만 업데이트
        if (currentNode.state.isProvingPlayerTurn) {
          // AND 노드
          // 프루프 넘버는 모든 자식 프루프 넘버의 합
          currentNode.proof = currentNode.children.reduce(
            (sum, child) => sum + child.proof,
            0,
          );
          // 디스프루프 넘버는 자식 디스프루프 넘버 중 최소값
          currentNode.disproof = Math.min(
            ...currentNode.children.map((child) => child.disproof),
          );
        } else {
          // OR 노드
          // 프루프 넘버는 자식 프루프 넘버 중 최소값
          currentNode.proof = Math.min(
            ...currentNode.children.map((child) => child.proof),
          );
          // 디스프루프 넘버는 모든 자식 디스프루프 넘버의 합
          currentNode.disproof = currentNode.children.reduce(
            (sum, child) => sum + child.disproof,
            0,
          );
        }
      }

      currentNode = currentNode.parent;
    }
  }
}
