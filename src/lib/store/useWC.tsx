import { josa } from "es-hangul";
import Cookies from "js-cookie";
import { isEqual } from "lodash";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { fire } from "../confetti";
import {
  losMent,
  startMentFirst,
  startMentNotFirst,
  winMent,
} from "../gameMents";
import { choice } from "../utils";
import { sampleRules } from "../wc/rules";
import {
  Char,
  CharType,
  objToInstance,
  SearchResult,
  WCDisplay,
  WCEngine,
  Word,
} from "../wc/WordChain";
export type changeInfo = {
  compPrev: Record<Char, { prevType: string; currType: string }>;
  compOrigin: Record<Char, { prevType: string; currType: string }>;
};

export const manners = ["제거 안 함", "한 번만 제거", "모두 제거"];

export const strengths = [
  { name: "쉬움", color: "text-blue-500 dark:text-blue-400" },
  { name: "보통", color: "text-yellow-500 dark:text-yellow-400" },
  { name: "어려움", color: "text-red-600 dark:text-red-500" },
];
export const turns = ["선공", "랜덤", "후공"];

export interface RuleForm {
  dict: number | { uploadedDict: string }; // 6
  pos: boolean[]; // 8
  cate: boolean[]; // 4
  chan: number;
  removeHeadTailDuplication: boolean;
  headDir: number;
  tailDir: number;
  headIdx: number;
  tailIdx: number;
  manner: number; // 0 : 없음, 1 : 제거, 2 : 연속적으로 제거
  regexFilter: string;
  addedWords1: string;
  addedWords2: string;
}

export type Chat = {
  isMy: boolean;
  isWord?: boolean;
  isDebug?: boolean;
  moveIdx?: number;
  chatIdx?: number;
  content: React.ReactNode;
};

export type GameInfo = {
  strength: 0 | 1 | 2;
  calcTime: number;
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
  setSearchInputValue: (value: string, preventPushState?: boolean) => void;
  exceptWords: string[];
  setExceptWords: (exceptWords: string[]) => void;
  searchResult: SearchResult;
  isMoreOpen: boolean;
  setIsMoreOpen: (isMoreOpen: boolean) => void;

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
  namedRule: string;

  // 플레이
  currGame?: GameInfo;
  setCurrGame: (gameInfo?: GameInfo) => void;

  gameSettingForm: {
    strength: 0 | 1 | 2;
    calcTime: number;
    turn: 0 | 1 | 2;
    steal: boolean;
    debug: boolean;
  };
  setGameSettingForm: (form: {
    strength: 0 | 1 | 2;
    calcTime: number;
    turn: 0 | 1 | 2;
    steal: boolean;
    debug: boolean;
  }) => void;
  makeMyMove: (move: Word) => void;
  isChatLoading: boolean;
  gameWorker?: Worker;
  killWorker: () => void;
  startWorker: () => void;
  getStarted: () => void;

  games: GameInfo[];
  setGames: (games: GameInfo[]) => void;

  // cookie

  // applyChan
  applyChan: boolean;
  setApplyChan: (applyChan: boolean) => void;
  // deleteMult
  deleteMult: boolean;
  setDeleteMult: (deleteMult: boolean) => void;
}

export const useWC = create<WCInfo>((set, get) => ({
  value: "",
  setValue: (value: string) => set(() => ({ value })),
  searchInputValue: "",
  setSearchInputValue: (
    searchInputValue: string,
    preventPushState?: boolean
  ) => {
    const engine = get().engine;
    set(() => ({
      searchInputValue,
      ...(engine
        ? {
            searchResult: WCDisplay.searchResult(
              engine,
              searchInputValue,
              get().applyChan,
              get().deleteMult
            ),
            isMoreOpen: false,
          }
        : {}),
    }));
    if (!preventPushState) {
      history.pushState(searchInputValue, "", "");
    }
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
  isMoreOpen: false,
  setIsMoreOpen: (isMoreOpen: boolean) => set(() => ({ isMoreOpen })),

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
          searchResult: WCDisplay.searchResult(
            engine,
            get().searchInputValue,
            get().applyChan,
            get().deleteMult
          ),
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
      currGame: undefined,
      engine: undefined,
      prevEngine: undefined,
      originalEngine: undefined,
      changeInfo: { compPrev: {}, compOrigin: {} },
      exceptWords: [],
      isLoading: true,
      rule: ruleForm,
      namedRule: isEqual(sampleRules[0].ruleForm, ruleForm)
        ? "guel"
        : isEqual(sampleRules[1].ruleForm, ruleForm)
        ? "sinel"
        : isEqual(sampleRules[8].ruleForm, ruleForm)
        ? "cheondo"
        : isEqual(sampleRules[11].ruleForm, ruleForm)
        ? "chaerin"
        : undefined,
    }));

    let worker = get().worker;
    if (worker) worker!.terminate();
    get().initWorker();
    worker = get().worker;
    worker!.postMessage({
      action: "getEngine",
      data: ruleForm,
    });
  },
  namedRule: "guel",

  gameWorker: undefined,
  currGame: undefined,
  setCurrGame: (gameInfo?: GameInfo) => {
    if (gameInfo === undefined) {
      const worker = get().gameWorker;
      // if (worker) {
      //   worker.postMessage({ action: "stopAnalysis" });
      // }
      worker!.terminate();
    }
    set(() => ({ currGame: gameInfo }));
  },

  gameSettingForm: {
    strength: 2,
    calcTime: 3,
    turn: 1,
    steal: true,
    debug: true,
  },
  setGameSettingForm: (form: {
    strength: 0 | 1 | 2;
    calcTime: number;
    turn: 0 | 1 | 2;
    steal: boolean;
    debug: boolean;
  }) => set(() => ({ gameSettingForm: form })),
  killWorker: () => {
    set({ isChatLoading: false });
    get().gameWorker?.terminate();
  },
  startWorker: () => {
    const gameWorker = new Worker(
      new URL("../worker/gameWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    gameWorker.postMessage({ action: "init", data: get().originalEngine });
    set(() => ({ gameWorker }));
    gameWorker!.onmessage = ({ data }) => {
      if (data.action === "getComputerMove") {
        const currGame = get().currGame!;
        const { word, isLos } = data.data;
        if (word) {
          if (isLos) {
            const newCurrGame: GameInfo = {
              ...currGame,
              moves: [...currGame.moves, word],
              chats: [
                ...currGame.chats,
                { isMy: false, isWord: true, content: word },
                {
                  isMy: false,
                  content: (
                    <div className="flex flex-col">
                      <div>{choice(winMent)}</div>
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
                  { isMy: false, isWord: true, content: word },
                  ...(currGame.moves.length === 0
                    ? [
                        {
                          isMy: false,

                          content: `'${word}'${josa(word.at(-1), "을/를").at(
                            -1
                          )} 입력하시면 단어를 뺏을 수 있어요!`,
                        },
                      ]
                    : []),
                ],
              },
              isChatLoading: false,
            });
          }
        } else {
          fire();

          const newCurrGame: GameInfo = {
            ...currGame,
            chats: [
              ...currGame.chats,
              {
                isMy: false,
                content: (
                  <div className="flex flex-col">
                    <div>{choice(losMent)}</div>
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
              ...messages.map(({ content }: { content: string }) => ({
                isMy: false,
                isDebug: true,
                content,
              })),
            ],
          },
        });
      }
    };
  },
  getStarted: () => {
    const gameWorker = new Worker(
      new URL("../worker/gameWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    gameWorker.postMessage({ action: "init", data: get().originalEngine });
    set(() => ({ gameWorker }));
    gameWorker!.onmessage = ({ data }) => {
      if (data.action === "getComputerMove") {
        const currGame = get().currGame!;
        const { word, isLos } = data.data;
        if (word) {
          if (isLos) {
            const newCurrGame: GameInfo = {
              ...currGame,
              moves: [...currGame.moves, word],
              chats: [
                ...currGame.chats,
                { isMy: false, isWord: true, content: word },
                {
                  isMy: false,
                  content: (
                    <div className="flex flex-col">
                      <div>{choice(winMent)}</div>
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
                  { isMy: false, isWord: true, content: word },
                  ...(currGame.moves.length === 0
                    ? [
                        {
                          isMy: false,

                          content: `'${word}'${josa(word.at(-1), "을/를").at(
                            -1
                          )} 입력하시면 단어를 뺏을 수 있어요!`,
                        },
                      ]
                    : []),
                ],
              },
              isChatLoading: false,
            });
          }
        } else {
          fire();

          const newCurrGame: GameInfo = {
            ...currGame,
            chats: [
              ...currGame.chats,
              {
                isMy: false,
                content: (
                  <div className="flex flex-col">
                    <div>{choice(losMent)}</div>
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
              ...messages.map(({ content }: { content: string }) => ({
                isMy: false,
                isDebug: true,
                content,
              })),
            ],
          },
        });
      }
    };

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
          calcTime: gameSettingForm.calcTime,
          steal: gameSettingForm.steal,
          debug: gameSettingForm.debug,

          chats: [
            {
              isMy: false,
              content: [<p>당신이 선공입니다!</p>],
            },
            {
              isMy: false,
              content: [<p>{choice(startMentNotFirst)}</p>],
            },
          ],

          moves: [],
          isPlaying: true,
        },
      });
    } else {
      gameWorker!.postMessage({
        action: "getComputerMove",
        data: {
          namedRule: get().namedRule,
          exceptWords: [],
          currChar: undefined,
          strength: gameSettingForm.strength,
          calcTime: gameSettingForm.calcTime,
          steal: true,

          debug: gameSettingForm.debug,
        },
      });
      set({
        isChatLoading: true,
        currGame: {
          isFirst,
          strength: gameSettingForm.strength,
          calcTime: gameSettingForm.calcTime,
          steal: gameSettingForm.steal,
          debug: gameSettingForm.debug,
          chats: [
            {
              isMy: false,
              content: <div>{choice(startMentFirst)}</div>,
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

    get().gameWorker!.postMessage({
      action: "getComputerMove",
      data: {
        namedRule: get().namedRule,
        exceptWords: moves,
        currChar: move.at(get().engine!.rule.tailIdx),
        strength: get().currGame!.strength,
        calcTime: get().currGame!.calcTime,
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

  applyChan: Cookies.get("apply-chan") === "false" ? false : true,
  setApplyChan: (applyChan: boolean) => {
    Cookies.set("apply-chan", `${applyChan}`);
    const engine = get().engine;
    set({
      applyChan,
      ...(engine
        ? {
            searchResult: WCDisplay.searchResult(
              engine,
              get().searchInputValue,
              applyChan,
              get().deleteMult
            ),
          }
        : {}),
    });
  },

  deleteMult: Cookies.get("delete-mult") === "true" ? true : false,
  setDeleteMult: (deleteMult: boolean) => {
    Cookies.set("delete-mult", `${deleteMult}`);
    const engine = get().engine;
    set({
      deleteMult,
      ...(engine
        ? {
            searchResult: WCDisplay.searchResult(
              engine,
              get().searchInputValue,
              get().applyChan,
              deleteMult
            ),
          }
        : {}),
    });
  },
}));
