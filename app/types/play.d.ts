export type Game = {
  id: string;

  calculatingDuration: number;
  isFirst: boolean;
  stealable: boolean;
  finished: boolean;
  isWin?: boolean;
  chats: Chat[];
  difficulty: 0 | 1 | 2;
  isMyTurn: boolean;
};

export type Chat = {
  id: string;
} & (
  | {
      type: "chat" | "move";
      isMy: boolean;
      content: string;
    }
  | { type: "debug"; content: string }
);
