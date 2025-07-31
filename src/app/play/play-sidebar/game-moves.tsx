import WordStack from "@/components/word-stack/word-stack";
import { getMovesFromChats, useWcStore } from "@/stores/wc-store";

export default function GameMoves({ id }: { id: string }) {
  const chats = useWcStore((e) => e.gameMap[id].chats);
  const moves = getMovesFromChats(chats);
  return moves.length > 0 && <WordStack words={moves} />;
}
