import type { WcStrategyTree } from "@/lib/wordchain/graph/strategy-tree";
import type { TreeData } from "@/types/search";
import { create } from "zustand";

interface TreeState {
  tree: WcStrategyTree | undefined;
  treeData: TreeData | undefined;
  setTree: (tree: WcStrategyTree) => void;
  selectIndex: (depth: number, index: number) => void;
}

export const useTreeStore = create<TreeState>()((set, get) => ({
  tree: undefined,
  treeData: undefined,
  setTree: (tree: WcStrategyTree) => {
    set({ tree, treeData: tree.getTreeData() });
  },
  selectIndex: (depth, index) => {
    const { tree } = get();

    tree!.selectIndex(depth, index);
    set({ treeData: tree!.getTreeData() });
  },
}));
