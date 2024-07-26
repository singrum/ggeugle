import { useWC } from "@/lib/store/useWC";
import Game from "./Game";
import GameList from "./GameList";
import GameSetting from "./GameSetting";

export default function Practice() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);

  return (
    <div className="bg-muted/40 md:h-full md:flex md:min-h-0 min-w-0 w-full">
      <div className="md:w-1/2 flex flex-col p-2 md:p-5 gap-5 h-[calc(100vh-2.25rem)] md:h-full">
        {/* <div className="text-2xl flex items-center gap-2"></div> */}
        <div className="flex-1 min-h-0">
          <div className="h-full w-full bg-background border border-border rounded-xl">
            {!currGame ? <GameSetting /> : <Game />}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0 h-full">
        <GameList />
      </div>
    </div>
  );
}
