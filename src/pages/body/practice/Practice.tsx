import { BotIcon, ChevronRight, Plus } from "lucide-react";
import React from "react";
import Chat from "./Chat";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { BsCpuFill } from "react-icons/bs";
import GameSetting from "./GameSetting";
import Game from "./Game";
import { useWC } from "@/lib/store/useWC";
import GameList from "./GameList";

export default function Practice() {
  const [currGame, games] = useWC((e) => [e.currGame, e.games]);

  return (
    <div className="bg-muted/40 h-full flex min-h-0 min-w-0 w-full">
      <div className="w-1/2 flex flex-col p-5 gap-5">
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
