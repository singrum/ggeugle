import CharButtons from "@/components/char-data-section/char-buttons";
import { searchResultMenuInfo } from "@/constants/search";
import {
  getHeadTail,
  removeDuplicatesFromIndex,
  wordsToMoves,
} from "@/lib/utils";
import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import { WordSolver } from "@/lib/wordchain/word/word-solver";

import type { StateCreator } from "zustand";

import type { ComparisonMap, SearchInputType } from "@/types/search";
import { toast } from "sonner";
import type { SearchSlice, Slices } from "../types/wc-store";

export const createSearchSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  SearchSlice
> = (set, get) => ({
  charMenu: 0,
  setCharMenu: (charMenu: 0 | 1 | 2 | 3) => {
    set({ charMenu });
  },

  view: 0,
  setView: (view: 0 | 1) => {
    const { setSearchInputValue, searchInputValue } = get();
    set({ view });
    setSearchInputValue(searchInputValue);
  },

  autoSearch: true,
  setAutoSearch: (v: boolean) => set({ autoSearch: v }),

  defaultAllOpen: true,
  setDefaultAllOpen: (v: boolean) => set({ defaultAllOpen: v }),

  comparisonToast: true,
  setComparisonToast: (v: boolean) => set({ comparisonToast: v }),

  charListDrawerOpen: false,
  setCharListDrawerOpen: (open: boolean) => set({ charListDrawerOpen: open }),

  pageSize: 1,
  setPageSize: (v: number) => set({ pageSize: v }),

  wordDispType: 0,
  setWordDispType: (v: number) => set({ wordDispType: v }),

  localSearchInputValue: "",
  setLocalSearchInputValue: (value: string) => {
    set({ localSearchInputValue: value });
  },
  searchInputValue: "",
  searchInputType: "empty",
  setSearchInputValue: (value: string) => {
    let searchInputType: SearchInputType = "empty";
    const {
      solver,
      view,
      rule,
      searchInputType: prevSearchInputType,
      searchResultMenu,
    } = get();

    if (solver === undefined || value.length === 0) {
      searchInputType = "empty";
    } else if (value.length >= 2) {
      searchInputType = "word";
    } else if (
      solver.graphSolver.getNodeType(
        value,
        view,
        sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
      ) === "route"
    ) {
      searchInputType = "route";
    } else {
      searchInputType = "winlose";
    }

    set({
      searchInputValue: value,
      searchInputType,
      searchResultMenu:
        searchInputType === prevSearchInputType ||
        (searchInputType === "winlose" && prevSearchInputType === "route") ||
        (searchInputType === "route" && prevSearchInputType === "winlose")
          ? searchResultMenu >= searchResultMenuInfo[searchInputType].length
            ? 0
            : searchResultMenu
          : 0,
    });
  },
  search: (value: string) => {
    const { setSearchInputValue, setLocalSearchInputValue } = get();
    setSearchInputValue(value);
    setLocalSearchInputValue(value);
  },
  searchResultMenu: 0,
  setSearchResultMenu: (searchResultMenu: number) => {
    set({ searchResultMenu });
  },

  onSolverUpdated: (solver: WordSolver) => {
    const {
      solver: prevSolver,
      rule,
      searchInputValue,
      setSearchInputValue,
      setComparisonMap,
      funcWorkerRunner,
    } = get();
    funcWorkerRunner.terminate();
    solver = WordSolver.fromObj(solver);
    set({
      exceptedWordsLoading: false,
      solver,
    });
    setComparisonMap(
      prevSolver!.graphSolver.getComparisonMap(
        solver.graphSolver,
        sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
      ),
    );

    setSearchInputValue(searchInputValue);
  },
  exceptedWords: [],
  setExceptedWords: async (words: string[]) => {
    const { originalSolver, onSolverUpdated } = get();

    if (words.length === 0) {
      set({
        exceptedWords: [],
      });
      onSolverUpdated(originalSolver!);
    } else {
      set({
        exceptedWords: words,
        exceptedWordsLoading: true,
      });

      const runner = get().funcWorkerRunner;
      const result = await runner.callAndTerminate("updateSolver", [
        originalSolver!.graphSolver.graphs,
        wordsToMoves(words, originalSolver!.headIdx, originalSolver!.tailIdx),
        get().flow,
      ]);

      const updatedWordMap = originalSolver!.wordMap.copy();
      words.forEach((e) =>
        updatedWordMap.removeWord(
          ...getHeadTail(e, originalSolver!.headIdx, originalSolver!.tailIdx),
          e,
        ),
      );
      const updatedSolver = WordSolver.fromObj({
        graphSolver: result,
        wordMap: updatedWordMap,
        headIdx: originalSolver!.headIdx,
        tailIdx: originalSolver!.tailIdx,
      } as WordSolver);

      onSolverUpdated(updatedSolver);
    }
  },

  addExceptedWord: (word: string) => {
    const { setExceptedWords, exceptedWords, solver } = get();

    if (
      word.length > 0 &&
      !exceptedWords.includes(word) &&
      solver?.wordMap.hasWord(word, solver.headIdx, solver.tailIdx)
    ) {
      setExceptedWords([...exceptedWords, word]);
    }
  },
  addExceptedWords: (words: string[]) => {
    const { setExceptedWords, exceptedWords, solver } = get();

    // 유효한 words인지
    words = words.filter(
      (e) =>
        e.length > 0 &&
        !exceptedWords.includes(e) &&
        solver?.wordMap.hasWord(e, solver.headIdx, solver.tailIdx),
    );
    // 유효한 것이 없다면 리턴
    if (words.length === 0) {
      return;
    }
    // 유효한 것 중 중복되는 거 제거
    words = removeDuplicatesFromIndex(
      [...exceptedWords, ...words],
      exceptedWords.length,
    );

    setExceptedWords(words);
  },
  removeExceptedWord: (word: string) => {
    const { setExceptedWords, exceptedWords } = get();
    setExceptedWords(exceptedWords.filter((e) => e !== word));
  },
  exceptedWordsLoading: false,

  setComparisonMap: (cmap: ComparisonMap) => {
    const { view, solver, rule, setSearchResultMenu, search, comparisonToast } =
      get();
    const changedNodes = Array.from(cmap[view].keys());

    if (comparisonToast && changedNodes.length > 0) {
      toast(
        <div className="flex flex-wrap items-center gap-2">
          <CharButtons
            chars={changedNodes.map((e) => ({
              char: e,
              variant: solver!.graphSolver.getNodeType(
                e,
                view,
                sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
              ),
            }))}
          />
          <span className="font-normal whitespace-nowrap">타입 변경됨.</span>
        </div>,
        {
          action: {
            label: "자세히 보기",
            onClick: () => {
              search("");
              const comparisonIdx = searchResultMenuInfo.empty.findIndex(
                (e) => e.title === "비교",
              );
              setSearchResultMenu(comparisonIdx);
            },
          },
        },
      );
    }

    set({ comparisonMap: cmap });
  },
});
