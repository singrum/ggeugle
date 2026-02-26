import { indexToNodeType } from "~/lib/wordchain/constants";
import type { WordSolver } from "~/lib/wordchain/word/word-solver";

import { useWcStore } from "~/stores/wc-store-provider";
import type {
  CharListData,
  RouteCharListData,
  WinloseCharListData,
} from "~/types/search";

import { useMemo } from "react";
import { RouteCharSectionList, WinloseCharSectionList } from "./char-section";

export default function CharList({ solver }: { solver: WordSolver }) {
  const charMenu = useWcStore((e) => e.charMenu);
  const view = useWcStore((e) => e.view);
  const data = useMemo<CharListData>(() => {
    if (charMenu === 3) {
      return solver.graphSolver.getRouteNodes(view);
    }

    return solver.graphSolver.getWinloseNodes(
      indexToNodeType[charMenu] as "win" | "lose" | "loopwin",
      view,
    );
  }, [solver, charMenu, view]);

  return charMenu !== 3 ? (
    <WinloseCharSectionList
      nodeType={indexToNodeType[charMenu] as "win" | "lose" | "loopwin"}
      charListData={data as WinloseCharListData}
    />
  ) : (
    <RouteCharSectionList charListData={data as RouteCharListData} />
  );
}
