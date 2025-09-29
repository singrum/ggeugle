import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import { v4 } from "uuid";

import { type StateCreator } from "zustand";

import type { WordMap } from "@/lib/wordchain/word/word-map";
import type { Chat, Game } from "../../types/play";

import {
  GameWorkerRunner,
  type GameWorkerRunnerOnmessageData,
} from "@/lib/worker/game-worker-runner";

import { fire } from "@/lib/confetti";
import {
  loseMessages,
  startFirstMessages,
  startSecondMessages,
  winMessages,
} from "@/lib/game-messages";
import { sample } from "lodash";
import type { InternalPlaySlice, PlaySlice, Slices } from "../types/wc-store";
import { getMovesFromChats } from "../wc-store";

export const createPlaySlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  PlaySlice
> = (set, get) => ({
  debugOpen: false,
  setDebugOpen: (value: boolean) => set({ debugOpen: value }),

  playDrawerOpen: false,
  setPlayDrawerOpen: (val: boolean) => set({ playDrawerOpen: val }),
  gameSettingsInfo: {
    difficulty: 2,
    calculatingDuration: 3,
    firstTurnForm: 1,
    stealable: true,
  },
  isDebug: false,
  selectedGame: null,
  games: [],
  gameMap: {},
  selectGame: (id: string | null) => {
    set({ selectedGame: id });
  },
  makeGame: () => {
    const { gameSettingsInfo, selectGame, takeComputersTurn } = get();

    const { difficulty, calculatingDuration, firstTurnForm, stealable } =
      gameSettingsInfo;
    const isFirst: boolean =
      firstTurnForm === 0
        ? true
        : firstTurnForm === 2
          ? false
          : Math.random() > 0.5;
    const id = v4();
    const game: Game = {
      id,
      difficulty,
      calculatingDuration,
      isFirst,
      stealable,
      finished: false,
      chats: [],
      isMyTurn: isFirst,
    };
    set((state) => {
      state.games.push(id);
      state.gameMap[id] = game;
    });

    selectGame(id);
    if (!isFirst) {
      get().addChat(id, {
        id: v4(),
        type: "chat",
        isMy: false,
        content: sample(startFirstMessages)!,
      });
      takeComputersTurn(id);
    } else {
      get().addChat(id, {
        id: v4(),
        type: "chat",
        isMy: false,
        content: sample(startSecondMessages)!,
      });
    }
  },
  deleteGame: (id: string) => {
    const { games, selectedGame } = get();

    const newArr = games.filter((e) => e !== id);
    set({ games: newArr });
    if (id === selectedGame) {
      get().selectGame(null);
    }
    if (get().games.length === 0) {
      get().setPlayDrawerOpen(false);
    }
  },
  deleteGameState: (id: string) => {
    if (internalPlaySlice.runnerMap[id]) {
      internalPlaySlice.runnerMap[id].terminate();
      delete internalPlaySlice.runnerMap[id];
    }

    set((state) => {
      delete state.gameMap[id];
    });
  },
  send: (content: string) => {
    const { isValidMove, selectedGame, takeComputersTurn, addChat } = get();
    if (!selectedGame) return;

    const isMove = isValidMove(content);

    addChat(selectedGame, {
      id: v4(),
      type: isMove ? "move" : "chat",
      content,
      isMy: true,
    });
    if (isMove) {
      get().setIsMyTurn(selectedGame, false);
      takeComputersTurn(selectedGame);
    }
  },
  addChat(gameId: string, chat: Chat) {
    set((state) => {
      if (
        chat.type !== "debug" &&
        chat.isMy &&
        !state.gameMap[gameId].isMyTurn
      ) {
        const chats = state.gameMap[gameId].chats;
        state.gameMap[gameId].chats.splice(chats.length - 1, 0, chat);
      } else {
        state.gameMap[gameId].chats.push(chat);
      }
    });

    scrollToLast();
  },

  isValidMove: (word: string) => {
    const { gameMap, originalSolver, rule, selectedGame } = get();
    if (!selectedGame) {
      return false;
    }
    const game = gameMap[selectedGame];
    if (word.length < 1) {
      return false;
    }
    if (game.finished) {
      return false;
    }
    const wordMap: WordMap = originalSolver!.wordMap;

    // 내 턴인지 체크
    if (!game.isMyTurn) {
      return false;
    }
    const moves = getMovesFromChats(game.chats);

    if (moves.length > 0) {
      const chars = sampleChangeFuncs[
        rule.wordConnectionRule.changeFuncIdx
      ].forward(moves.at(-1)!.at(originalSolver!.tailIdx)!);
      if (moves.length === 1) {
        if (
          moves[0] !== word &&
          !chars.includes(word.at(originalSolver!.headIdx)!)
        ) {
          return false;
        }
      } else if (!chars.includes(word[0])) {
        return false;
      } else if (moves.includes(word)) {
        return false;
      }
    }

    if (
      !wordMap.hasWord(word, originalSolver!.headIdx, originalSolver!.tailIdx)
    ) {
      return false;
    }

    return true;
  },

  takeComputersTurn: (id: string) => {
    const { gameMap, originalSolver, finishGame } = get();
    const game = gameMap[id];
    const history = getMovesFromChats(game.chats);
    const callbackId = v4();

    const runner = new GameWorkerRunner(
      originalSolver!,
      game.difficulty,
      game.calculatingDuration,
      game.stealable,
      history,
      get().prec,
      (e: GameWorkerRunnerOnmessageData) => {
        if (callbackId !== internalPlaySlice.runnerMap?.[id]?.id) return;
        if (e.action === "computerWin") {
          finishGame(id, false);
          return;
        } else if (e.action === "debug") {
          get().pushDebug(id, e.payload);
        } else if (e.action === "move") {
          get().addChat(id, {
            id: v4(),
            type: "move",
            content: e.payload,
            isMy: false,
          });
        } else if (e.action === "messageEnd") {
          get().setIsMyTurn(id, true);
          scrollToLast();
          delete internalPlaySlice.runnerMap[id];
        }
      },
      callbackId,
    );

    if (runner.isLose()) {
      fire();
      finishGame(id, true);
    } else {
      internalPlaySlice.runnerMap[id] = runner;
      get().initDebug(id);
      runner.run(get().flow);
    }
  },
  setIsMyTurn(gameId: string, value: boolean) {
    set((state) => {
      state.gameMap[gameId].isMyTurn = value;
    });
  },
  initDebug: (id: string) => {
    const { addChat } = get();
    addChat(id, {
      id: v4(),
      type: "debug",
      content: "",
    });
  },
  pushDebug: (id: string, debug: string) => {
    set((state) => {
      const game = state.gameMap[id];
      if (!game) return;
      const lastChat = game.chats.at(-1);
      if (lastChat?.type !== "debug") return;
      lastChat.content = lastChat.content.concat(debug);
    });
  },
  getSelectedGame: () => {
    const { selectedGame, gameMap } = get();
    return gameMap[selectedGame!];
  },
  finishGame: (id: string, isWin: boolean) => {
    set((state) => {
      state.gameMap[id].isWin = isWin;
      state.gameMap[id].finished = true;
    });

    if (isWin === true) {
      get().addChat(id, {
        id: v4(),
        type: "chat",
        isMy: false,
        content: sample(loseMessages)!,
      });
    } else {
      get().addChat(id, {
        id: v4(),
        type: "chat",
        isMy: false,
        content: sample(winMessages)!,
      });
      delete internalPlaySlice.runnerMap[id];
    }
    get().setIsMyTurn(id, true);
  },
  copyMoves(id: string) {
    const { gameMap } = get();

    navigator.clipboard.writeText(
      getMovesFromChats(gameMap[id].chats).join(" "),
    );
  },
  undoMove(gameId: string, chatId: string) {
    set((state) => {
      const chats = state.gameMap[gameId].chats;
      const idx = chats.findIndex((chat) => chat.id === chatId);
      chats.splice(idx);
      state.gameMap[gameId].isWin = undefined;
      state.gameMap[gameId].finished = false;
    });

    get().setIsMyTurn(gameId, true);
    const runner = internalPlaySlice.runnerMap[gameId];
    if (runner) {
      runner.terminate();
      delete internalPlaySlice.runnerMap[gameId];
    }
  },
});

export const internalPlaySlice: InternalPlaySlice = {
  runnerMap: {},
};

function scrollToLast() {
  setTimeout(() => {
    document.getElementById("chatbox")?.scrollTo({
      top: document.getElementById("chatbox")!.scrollHeight,
      behavior: "instant",
    });
  }, 10);
}
