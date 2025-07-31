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

// 난이도 : 쉬움
// 랜덤 단어
// 가위, 가가, 가구, ...
// -> 가족

// 난이도 : 보통
// 공격 단어
// 기쁨

// 방어 단어
// 꾼내

// 랜덤 루트 단어
// ㄴㅇㅁㄹ

// 난이도 : 어려움
// 루트 단어
// 굉업 : 패배
// 굉굉 : 패배
// 굉확 : 패배
// 굉척 : 승리
