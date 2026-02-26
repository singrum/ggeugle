import { useWcStore } from "~/stores/wc-store-provider";

import GameSettings from "./game-settings/game-settings";
import Game from "./game/game";
import MobilePlayDrawer from "./mobile-play-drawer";
export default function Play() {
  const selectedGame = useWcStore((e) => e.selectedGame);
  return (
    <div className="flex h-full w-full min-w-0 flex-col flex-1">
      {selectedGame === null ? <GameSettings /> : <Game id={selectedGame} />}
      <MobilePlayDrawer />
    </div>
  );
}
