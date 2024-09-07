import { useWC } from "@/lib/store/useWC";

import Game from "./Game";
import GameList from "./GameList";
import GameSetting from "./GameSetting";

export default function Practice() {
  const [currGame] = useWC((e) => [e.currGame]);

  return (
    <div className="h-full md:h-full md:flex md:min-h-0 min-w-0 w-full overflow-auto">
      <div className="md:w-1/2 flex flex-col p-0 md:p-4 md:pr-0 h-[calc(100vh-100px)] md:h-full md:max-w-screen-sm">
        <div className="flex-1 min-h-0">
          <div className="h-full w-full bg-background border-y md:border border-border md:rounded-xl">
            {!currGame ? <GameSetting /> : <Game />}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-[100px] md:h-full">
        <GameList />
      </div>
    </div>
  );
}
