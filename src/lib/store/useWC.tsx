import { josa } from "es-hangul";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { create } from "zustand";
import {
  Char,
  CharType,
  objToInstance,
  SearchResult,
  WCDisplay,
  WCEngine,
  Word,
} from "../wc/WordChain";
import { sampleRules } from "../wc/rules";

export type changeInfo = {
  compPrev: Record<Char, { prevType: string; currType: string }>;
  compOrigin: Record<Char, { prevType: string; currType: string }>;
};

export const dicts = [
  "(구)표준국어대사전",
  "(신)표준국어대사전",
  "우리말샘",
  "네이버 국어사전",
  "끄투 노인정",
  "끄투 어인정",
  "test",
];

export const poses = [
  "명사",
  "의존명사",
  "대명사",
  "수사",
  "부사",
  "관형사",
  "감탄사",
  "구",
  "무품사",
];

export const cates = ["일반어", "방언", "북한어", "옛말"];

export const strengths = [
  { name: "쉬움", color: "text-blue-500 dark:text-blue-400" },
  { name: "보통", color: "text-yellow-600 dark:text-yellow-400" },
  { name: "어려움", color: "text-red-600 dark:text-red-500" },
];
export const turns = ["선공", "랜덤", "후공"];

export interface RuleForm {
  dict: number; // 4
  pos: boolean[]; // 8
  cate: boolean[]; // 4
  chan: number;
  removeHeadTailDuplication: boolean;
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
  steal?: boolean;
  debug?: boolean;

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
    steal: boolean;
    debug: boolean;
  };
  setGameSettingForm: (form: {
    strength: 0 | 1 | 2;
    turn: 0 | 1 | 2;
    steal: boolean;
    debug: boolean;
  }) => void;
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
      if (data.action === "getEngine") {
        const engine = objToInstance(data.data as WCEngine);

        const prevEngine = get().engine;
        const originalEngine = get().originalEngine;

        set(() => ({
          prevEngine,
          engine,
          isLoading: false,
          searchResult: WCDisplay.searchResult(engine, get().searchInputValue),
          ...(originalEngine ? {} : { originalEngine: engine }),
        }));

        if (engine && prevEngine) {
          let exist = false;
          const changeInfo: changeInfo = { compPrev: {}, compOrigin: {} };
          for (let { changeType, compEngine } of [
            { changeType: "compPrev", compEngine: prevEngine! },
            { changeType: "compOrigin", compEngine: originalEngine! },
          ]) {
            for (let char in compEngine.chanGraph.nodes) {
              const prevType = WCDisplay.reduceWordtype(
                compEngine!.chanGraph.nodes[char].type as CharType
              );
              const currType = engine!.chanGraph.nodes[char]
                ? WCDisplay.reduceWordtype(
                    engine!.chanGraph.nodes[char].type as CharType
                  )
                : "deleted";
              if (prevType !== currType) {
                changeInfo[changeType as "compPrev" | "compOrigin"][char] = {
                  prevType,
                  currType,
                };
                if (changeType === "compPrev") {
                  exist = true;
                }
              }
            }
          }

          if (exist) {
            const changedChars = Object.keys(changeInfo.compPrev);
            toast((t) => (
              <div
                className="text-black gap-1 pr-4"
                onClick={() => {
                  document.getElementById("changed-char-dialog-open")?.click();
                  toast.dismiss(t.id);
                }}
              >
                <div className="flex flex-col cursor-pointer gap-1">
                  {changedChars.slice(0, 1).map((char) => (
                    <div key={char}>
                      <span>{char}</span>
                      {josa(char, "이/가").at(-1)}{" "}
                      <span
                        className={`text-${
                          changeInfo.compPrev[char].prevType === "win"
                            ? "sky-600"
                            : changeInfo.compPrev[char].prevType === "los"
                            ? "rose-600"
                            : "green-600"
                        }`}
                      >
                        {changeInfo.compPrev[char].prevType === "route"
                          ? "루트"
                          : changeInfo.compPrev[char].prevType === "win"
                          ? "승리"
                          : "패배"}
                      </span>
                      에서{" "}
                      {changeInfo.compPrev[char].currType !== "deleted" ? (
                        <>
                          <span
                            className={`text-${
                              changeInfo.compPrev[char].currType === "win"
                                ? "sky-600"
                                : changeInfo.compPrev[char].currType === "los"
                                ? "rose-600"
                                : changeInfo.compPrev[char].currType === "route"
                                ? "green-600"
                                : "black"
                            }`}
                          >
                            {changeInfo.compPrev[char].currType === "route"
                              ? "루트"
                              : changeInfo.compPrev[char].currType === "win"
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
                  {changedChars.length > 1 && (
                    <div className="">
                      외 {changedChars.length - 1}개 더보기
                    </div>
                  )}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                  }}
                  className="text-[hsl(240,3.8%,46.1%)] hover:bg-[hsl(240,4.8%,95.9%)] hover:text-black flex justify-center items-center p-1 rounded-full cursor-pointer absolute right-2 top-2"
                >
                  <X className="w-4 h-4" />
                </div>
              </div>
            ));
          }
          set(() => ({ changeInfo }));
        }
      } else if (data.action === "getComputerMove") {
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
                chats: [
                  ...currGame.chats,
                  { isMy: false, content: word },
                  ...(currGame.moves.length === 0
                    ? [
                        {
                          isMy: false,
                          content: `'${word}'${josa(word.at(-1), "을/를").at(
                            -1
                          )} 입력하시면 단어를 뺏을 수 있습니다.`,
                        },
                      ]
                    : []),
                ],
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
      } else if (data.action === "debug") {
        const currGame = get().currGame!;
        const { messages } = data.data;
        set({
          currGame: {
            ...currGame,
            chats: [
              ...currGame.chats,
              ...messages.map((message: string) => ({
                isMy: false,
                content: message,
              })),
            ],
          },
        });
      }
    };
  },
  isLoading: true,
  changeInfo: { compPrev: {}, compOrigin: {} },
  setChangeInfo: (changeInfo) => {
    set(() => ({
      changeInfo,
    }));
  },

  rule: sampleRules[0].ruleForm,
  ruleForm: sampleRules[0].ruleForm,
  setRuleForm: (ruleForm: RuleForm) => set({ ruleForm }),
  updateRule: () => {
    const ruleForm = get().ruleForm;

    set(() => ({
      engine: undefined,
      prevEngine: undefined,
      originalEngine: undefined,
      changeInfo: { compPrev: {}, compOrigin: {} },
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
  gameSettingForm: { strength: 2, turn: 1, steal: true, debug: false },
  setGameSettingForm: (form: {
    strength: 0 | 1 | 2;
    turn: 0 | 1 | 2;
    steal: boolean;
    debug: boolean;
  }) => set(() => ({ gameSettingForm: form })),

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
        isChatLoading: false,
        currGame: {
          isFirst,
          strength: gameSettingForm.strength,
          steal: gameSettingForm.steal,
          debug: gameSettingForm.debug,

          chats: [
            {
              isMy: false,
              content: (
                <div>
                  게임이 시작되었습니다!
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
          steal: true,

          debug: gameSettingForm.debug,
        },
      });
      set({
        isChatLoading: true,
        currGame: {
          isFirst,
          strength: gameSettingForm.strength,
          steal: gameSettingForm.steal,
          debug: gameSettingForm.debug,
          chats: [
            {
              isMy: false,
              content: <div>게임이 시작되었습니다!</div>,
            },
          ],
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
        steal: get().currGame!.steal,
        debug: get().currGame!.debug,
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
