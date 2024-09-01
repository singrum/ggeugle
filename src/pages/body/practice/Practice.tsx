import { useMediaQuery } from "@/hooks/use-media-query";
import { useWC } from "@/lib/store/useWC";
import Header from "@/pages/header/Header";

import Game from "./Game";
import GameList from "./GameList";
import GameSetting from "./GameSetting";

export default function Practice() {
  const [currGame] = useWC((e) => [e.currGame]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="h-full md:h-full md:flex md:min-h-0 min-w-0 w-full overflow-auto">
      {/* {!isDesktop && <Header />} */}
      <div className="md:w-1/2 flex flex-col p-3 md:p-5 md:pr-0 gap-5 h-[calc(100vh-100px)] md:h-full max-w-screen-sm">
        <div className="flex-1 min-h-0">
          <div className="h-full w-full bg-background border border-border rounded-xl">
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
