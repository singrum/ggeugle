import type { RuleForm } from "@/types/rule";
import type {
  ComparisonMap,
  CriticalWordInfo,
  MoveType,
  PrecInfo,
  SearchInputType,
  SingleThreadSearechStatus,
} from "@/types/search";
import { type DebouncedFuncLeading } from "lodash";

import type {
  NodeName,
  NodeType,
  SingleMove,
} from "@/lib/wordchain/graph/graph";

import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import type { ComlinkRunner } from "@/lib/worker/comlink-runner";
import type { FuncWorkerApi } from "@/lib/worker/func-worker";
import type { GameWorkerRunner } from "@/lib/worker/game-worker-runner";
import type { Chat, Game } from "../../types/play";

export type RuleSlice = {
  funcWorkerRunner: ComlinkRunner<FuncWorkerApi>;
  onSolverLoaded: (solver: WordSolver) => void;

  kkutuLocalRule: { gameType: number; manner: number; injeong: boolean };
  setKkutuRule: () => void;
  localRule: RuleForm;
  ruleJsonInputValue: string;
  initRuleJsonInputValue: () => void;
  setRuleJsonInputValue: (value: string) => void;
  isValidJson: boolean;
  rule: RuleForm;
  updateRule: () => Promise<void>;
  restoreLocalRule: () => void;
  setRule: (rule: RuleForm) => void;
  syncRule: () => void;
  originalSolver?: WordSolver;
  solver?: WordSolver;

  ruleSettingsMenu: number;
  setRuleSettingsMenu: (menu: number) => void;
};

export type SearchSlice = {
  charMenu: 0 | 1 | 2 | 3;
  setCharMenu: (charMenu: 0 | 1 | 2) => void;

  charListDrawerOpen: boolean;
  setCharListDrawerOpen: (open: boolean) => void;

  view: 0 | 1;
  setView: (view: 0 | 1) => void;

  autoSearch: boolean;
  setAutoSearch: (value: boolean) => void;

  defaultAllOpen: boolean;
  setDefaultAllOpen: (value: boolean) => void;

  comparisonToast: boolean;
  setComparisonToast: (v: boolean) => void;

  pageSize: number;
  setPageSize: (v: number) => void;

  localSearchInputValue: string;
  setLocalSearchInputValue: (value: string) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  search: (value: string) => void;
  searchInputType: SearchInputType;
  searchResultMenu: number;
  setSearchResultMenu: (searchResultMenu: number) => void;

  // searchHistory: string[];
  // onClickHistory: (i: number) => void;
  // addSearchHistory: (v: string) => void;

  onSolverUpdated: (solver: WordSolver) => void;
  exceptedWords: string[];
  setExceptedWords: (words: string[]) => void;
  addExceptedWord: (word: string) => void;
  addExceptedWords: (words: string[]) => void;
  removeExceptedWord: (word: string) => void;
  exceptedWordsLoading: boolean;

  comparisonMap?: ComparisonMap;
  setComparisonMap: (cmap: ComparisonMap) => void;
};

export type StrategySearchSlice = {
  // 전략 탐색
  strategySearchMethod: number;
  setStrategySearchMethod: (strategySearchMethod: number) => void;
  maxThreadValue: string;
  setMaxThreadValue: (val: string) => void;
  //// 싱글 쓰레드

  initSingleThreadSearch: () => void;
  startSingleThreadSearch: (move: SingleMove) => void;
  maximizeSingleThreadSearch: () => void;
  truncateSingleThreadSearch: () => void;
  resetSingleThreadSearch: (move: SingleMove) => void;
  singleThreadSearchInfo: {
    moves: [NodeName, NodeName][];
    mapping: Record<
      NodeName,
      Record<
        NodeName,
        {
          id?: string;
          runner?: ComlinkRunner<FuncWorkerApi>;
          status: SingleThreadSearechStatus;
          isWin?: boolean;
          stack: SingleMove[];
          duration?: number;
        }
      >
    >;
  };
  clearSingleThreadSearch: () => void;
  prec: PrecInfo;
};

export type CriticalWordsSlice = {
  criticalWordsCallbackId?: string;
  criticalEdgeMap?: Record<NodeName, Record<NodeName, CriticalWordInfo>>;
  criticalWordsWorkerRunner?: ComlinkRunner<FuncWorkerApi>;
  initCriticalWords: () => void;
  clearCriticalWords: () => void;
  criticalWordsThrottledUpdate: DebouncedFuncLeading<
    (
      criticalEdgeMap: Record<NodeName, Record<NodeName, CriticalWordInfo>>,
    ) => void
  >;
};

export type PlaySlice = {
  debugOpen: boolean;
  setDebugOpen: (value: boolean) => void;

  playDrawerOpen: boolean;
  setPlayDrawerOpen: (val: boolean) => void;
  gameSettingsInfo: {
    difficulty: 0 | 1 | 2;
    calculatingDuration: number;
    firstTurnForm: number;
    stealable: boolean;
  };
  isDebug: boolean;
  selectedGame: string | null;
  games: string[];
  gameMap: Record<string, Game>;
  selectGame: (id: string | null) => void;
  makeGame: () => void;
  deleteGame: (id: string) => void;
  deleteGameState: (id: string) => void;
  send: (content: string) => void;
  addChat: (gameId: string, chat: Chat) => void;
  isValidMove: (word: string) => boolean;
  takeComputersTurn: (id: string) => void;
  finishGame: (id: string, isWin: boolean) => void;
  getSelectedGame: () => Game;
  setIsMyTurn: (gameId: string, value: boolean) => void;
  initDebug: (id: string) => void;
  pushDebug: (id: string, debug: string) => void;
  copyMoves: (id: string) => void;
  undoMove: (gameId: string, chatId: string) => void;
};

export type InternalPlaySlice = {
  runnerMap: Record<string, GameWorkerRunner>;
};

export type InfoSlice = {
  isDefaultOpenDonation: boolean;
};

export type DistributionSlice = {
  distributionNodeType: NodeType;
  wordDistributionOption:
    | {
        type: "adjacent";
        direction: 0 | 1;
        sort: { key: MoveType | "total"; desc: boolean };
        displayType: "number" | "fraction";
      }
    | {
        type: "ratio" | "difference";
        wordTypes: [MoveType | "total", MoveType | "total"];
        desc: boolean;
      };
  distributionTablePage: number;
  setDistributionTablePage: (page: number) => void;
  distributionData?:
    | {
        char: string;
        num: number[];
      }[]
    | {
        char: string;
        num: number[];
      }[]
    | undefined;
  setDistributionData: (data: DistributionSlice["distributionData"]) => void;
  distributionRows: number[];
};

export type KnowledgeSlice = {
  knowledgeMenuOpen: boolean;
  setKnowledgeMenuOpen: (v: boolean) => void;
};

export type Slices = RuleSlice &
  SearchSlice &
  StrategySearchSlice &
  CriticalWordsSlice &
  PlaySlice &
  InfoSlice &
  DistributionSlice &
  KnowledgeSlice;
