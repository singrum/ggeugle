import { useWcStore } from "@/stores/wc-store";

import GameSettings from "./game-settings/game-settings";
import Game from "./game/game";
import MobilePlayDrawer from "./mobile-play-drawer";
export default function Play() {
  const selectedGame = useWcStore((e) => e.selectedGame);

  return (
    <div className="flex h-full max-h-[100dvh] w-full min-w-0 flex-col">
      {selectedGame === null ? <GameSettings /> : <Game id={selectedGame} />}
      <MobilePlayDrawer />
    </div>
  );
}
