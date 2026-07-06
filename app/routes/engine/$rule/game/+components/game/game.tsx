import { useEffect } from "react";
import { useWcStore } from "~/stores/wc-store-provider";
import ChatBar from "../chat/chat-bar";
import ChatList from "../chat/chat-list";

export default function Game({ id }: { id: string }) {
  const chats = useWcStore((e) => e.gameMap[id].chats);
  const difficulty = useWcStore((e) => e.gameMap[id].difficulty);
  const isMyTurn = useWcStore((e) => e.gameMap[id].isMyTurn);
  const finished = useWcStore((e) => e.gameMap[id].finished);
  useEffect(() => {
    document.getElementById("chatbox")!.scrollTop =
      document.getElementById("chatbox")!.scrollHeight;
  }, [id]);
  return (
    <>
      <div
        className="h-full max-h-full min-h-0 flex-1 no-scrollbar overflow-auto w-full flex flex-col scroll-fade-b"
        id="chatbox"
      >
        <div className="max-w-3xl w-full mx-auto mt-auto">
          <ChatList chats={chats} difficulty={difficulty} loading={!isMyTurn} />
        </div>
      </div>
      <ChatBar disabled={finished} />
    </>
  );
}
