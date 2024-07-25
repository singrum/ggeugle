import { create } from "zustand";
import { Char, SearchResult, WCDisplay, WCEngine, Word } from "../wc/wordChain";

import toast from "react-hot-toast";

import { josa } from "es-hangul";
export type changeInfo = Record<Char, { prevType: string; currType: string }>;

export const dicts = ["(구)표국대", "(신)표국대", "우리말샘"];

export const poses = [
  "명사",
  "의존명사",
  "대명사",
  "수사",
  "부사",
  "관형사",
  "감탄사",
  "구",
];

export const cates = ["일반어", "방언", "북한어", "옛말"];

export const strengths = [
  { name: "쉬움", color: "text-blue-400" },
  { name: "보통", color: "text-yellow-400" },
  { name: "어려움", color: "text-red-500" },
];
export const turns = ["선공", "랜덤", "후공"];

export interface RuleForm {
  dict: number;
  pos: boolean[]; // 8
  cate: boolean[]; // 4
  chan: number;
  headDir: number;
  tailDir: number;
  headIdx: number;
  tailIdx: number;
  manner: boolean;
  regexFilter: string;
  addedWords: string;
}

export type Chat = {
  isMy: boolean;
  content: React.ReactNode;
};

export type GameInfo = {
  strength: 0 | 1 | 2;
  isFirst: boolean;
  chats: Chat[];
  moves: Word[];
  isPlaying: boolean;
  winner?: "computer" | "me";
};

export interface WCInfo {
  value: string;
  setValue: (value: string) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  exceptWords: string[];
  setExceptWords: (exceptWords: string[]) => void;
  searchResult: SearchResult;

  worker?: Worker;
  originalEngine?: WCEngine;
  prevEngine?: WCEngine;
  engine?: WCEngine;
  initWorker: () => void;
  isLoading: boolean;
  changeInfo: changeInfo;
  setChangeInfo: (changeInfo: changeInfo) => void;

  // 룰 설정
  rule: RuleForm;
  ruleForm: RuleForm;
  setRuleForm: (ruleForm: RuleForm) => void;
  updateRule: () => void;

  // 연습
  currGame?: GameInfo;
  setCurrGame: (gameInfo?: GameInfo) => void;
  gameSettingForm: {
    strength: 0 | 1 | 2;
    turn: 0 | 1 | 2;
  };
  setGameSettingForm: (form: { strength: 0 | 1 | 2; turn: 0 | 1 | 2 }) => void;
  makeMyMove: (move: Word) => void;
  isChatLoading: boolean;
  getStarted: () => void;

  games: GameInfo[];
  setGames: (games: GameInfo[]) => void;
}

export const useWC = create<WCInfo>((set, get) => ({
  value: "",
  setValue: (value: string) => set(() => ({ value })),
  searchInputValue: "",
  setSearchInputValue: (searchInputValue: string) => {
    set(() => ({
      searchInputValue,
      searchResult: WCDisplay.searchResult(get().engine!, searchInputValue),
    }));
  },
  exceptWords: [],
  setExceptWords: (exceptWords: string[]) => {
    set(() => ({ exceptWords, isLoading: true }));

    get().worker!.postMessage({
      action: "setWords",
      data: exceptWords,
    });
  },
  searchResult: undefined,

  worker: undefined,
  originalEngine: undefined,
  engine: undefined,
  initWorker: () => {
    const worker = new Worker(new URL("../worker/worker.ts", import.meta.url), {
      type: "module",
    });
    set(() => ({ worker }));

    worker!.onmessage = ({ data }) => {
      switch (data.action) {
        case "getEngine":
          const engine = data.data;
          const prevEngine = get().engine;
          const originalEngine = get().originalEngine;
          set(() => ({
            prevEngine,
            engine,
            isLoading: false,
            searchResult: WCDisplay.searchResult(engine!, get().value),
            ...(originalEngine ? {} : { originalEngine: engine }),
          }));
          if (engine && prevEngine) {
            let exist = false;
            const changeInfo: Record<
              Char,
              { prevType: string; currType: string }
            > = {};
            for (let char in prevEngine!.charInfo) {
              const prevType = WCDisplay.reduceWordtype(
                prevEngine!.charInfo[char].type!
              );
              const currType = engine!.charInfo[char]
                ? WCDisplay.reduceWordtype(engine!.charInfo[char].type!)
                : "deleted";
              if (prevType !== currType) {
                changeInfo[char] = { prevType, currType };
                exist = true;
              }
            }
            if (exist) {
              const changedChars = Object.keys(changeInfo);
              toast(
                <div
                  className="flex flex-col text-muted-foreground cursor-pointer gap-1 "
                  onClick={() =>
                    document.getElementById("changed-char-dialog-open")?.click()
                  }
                >
                  {changedChars.slice(0, 3).map((char) => (
                    <div key={char}>
                      <span className="text-foreground">{char}</span>
                      {josa(char, "이/가").at(-1)}{" "}
                      <span className={`text-${changeInfo[char].prevType}`}>
                        {changeInfo[char].prevType === "route"
                          ? "루트"
                          : changeInfo[char].prevType === "win"
                          ? "승리"
                          : "패배"}
                      </span>
                      에서{" "}
                      {changeInfo[char].currType !== "deleted" ? (
                        <>
                          <span className={`text-${changeInfo[char].currType}`}>
                            {changeInfo[char].currType === "route"
                              ? "루트"
                              : changeInfo[char].currType === "win"
                              ? "승리"
                              : "패배"}
                          </span>
                          {"로 변경"}
                        </>
                      ) : (
                        "삭제됨"
                      )}
                    </div>
                  ))}
                  {changedChars.length > 3 && (
                    <div className="hover:underline hover:text-foreground">
                      외 {changedChars.length - 3}개 더보기
                    </div>
                  )}
                </div>
              );
            }
            set(() => ({ changeInfo }));
          }
          break;
        case "getComputerMove":
          const currGame = get().currGame!;
          const { word, isLos } = data.data;
          if (word) {
            if (isLos) {
              const newCurrGame: GameInfo = {
                ...currGame,
                moves: [...currGame.moves, word],
                chats: [
                  ...currGame.chats,
                  { isMy: false, content: word },
                  {
                    isMy: false,
                    content: (
                      <div className="flex flex-col">
                        <div>게임이 끝났습니다.</div>
                        <div>끄글봇의 승리입니다!</div>
                      </div>
                    ),
                  },
                ],
                isPlaying: false,
                winner: "computer",
              };

              set({
                currGame: newCurrGame,
                isChatLoading: false,
                games: [...get().games, newCurrGame],
              });
            } else {
              set({
                currGame: {
                  ...currGame,
                  moves: [...currGame.moves, word],
                  chats: [...currGame.chats, { isMy: false, content: word }],
                },
                isChatLoading: false,
              });
            }
          } else {
            const newCurrGame: GameInfo = {
              ...currGame,
              chats: [
                ...currGame.chats,
                {
                  isMy: false,
                  content: (
                    <div className="flex flex-col">
                      <div>게임이 끝났습니다.</div>
                      <div>당신의 승리입니다!</div>
                    </div>
                  ),
                },
              ],
              isPlaying: false,
              winner: "me",
            };
            set({
              isChatLoading: false,
              currGame: newCurrGame,
              games: [...get().games, newCurrGame],
            });
          }
      }
    };
  },
  isLoading: true,
  changeInfo: {},
  setChangeInfo: (changeInfo) => {
    set(() => ({
      changeInfo,
    }));
  },

  rule: {
    dict: 0,
    pos: [true, false, false, false, false, false, false, false],
    cate: [true, true, true, true],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1,
    manner: false,
    regexFilter: ".*",
    addedWords: "",
  },
  ruleForm: {
    dict: 0,
    pos: [true, false, false, false, false, false, false, false],
    cate: [true, true, true, true],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1,
    manner: false,
    regexFilter: ".*",
    addedWords: "",
  },
  setRuleForm: (ruleForm: RuleForm) => set({ ruleForm }),
  updateRule: () => {
    const ruleForm = get().ruleForm;

    set(() => ({
      engine: undefined,
      prevEngine: undefined,
      exceptWords: [],
      isLoading: true,

      rule: ruleForm,
    }));
    const worker = get().worker;
    if (!worker) {
      get().initWorker();
    }

    get().worker!.postMessage({
      action: "getEngine",
      data: ruleForm,
    });
  },
  currGame: undefined,
  setCurrGame: (gameInfo?: GameInfo) => {
    set(() => ({ currGame: gameInfo }));
  },
  gameSettingForm: { strength: 1, turn: 1 },
  setGameSettingForm: (form: { strength: 0 | 1 | 2; turn: 0 | 1 | 2 }) =>
    set(() => ({ gameSettingForm: form })),

  getStarted: () => {
    const gameSettingForm = get().gameSettingForm;
    const isFirst =
      gameSettingForm.turn === 0
        ? true
        : gameSettingForm.turn === 2
        ? false
        : Math.random() < 0.5;

    if (isFirst) {
      set({
        currGame: {
          isFirst,
          strength: gameSettingForm.strength,
          chats: [
            {
              isMy: false,
              content: (
                <div>
                  당신의 차례입니다.
                  <br />
                  먼저 단어를 입력해 주세요.
                </div>
              ),
            },
          ],
          moves: [],
          isPlaying: true,
        },
      });
    } else {
      get().worker!.postMessage({
        action: "getComputerMove",
        data: {
          exceptWords: [],
          currChar: undefined,
          strength: gameSettingForm.strength,
        },
      });
      set({
        currGame: {
          isFirst,
          strength: gameSettingForm.strength,
          chats: [],
          moves: [],
          isPlaying: true,
        },
      });
    }
  },
  moves: [],
  makeMyMove: (move: Word) => {
    const currGame = get().currGame!;
    const moves = [...currGame.moves, move];

    set({ currGame: { ...currGame, moves }, isChatLoading: true });

    get().worker!.postMessage({
      action: "getComputerMove",
      data: {
        exceptWords: moves,
        currChar: move.at(get().engine!.rule.tailIdx),
        strength: get().currGame!.strength,
      },
    });
  },
  isChatLoading: false,

  games: [],
  setGames: (games: GameInfo[]) =>
    set(() => ({
      games,
    })),
}));
