import { BotIcon } from "lucide-react";
import React from "react";
import Chat from "./Chat";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { BsCpuFill } from "react-icons/bs";
import GameSetting from "./GameSetting";
import Game from "./Game";
import { useWC } from "@/lib/store/useWC";

export default function Practice() {
  const started = useWC((e) => e.started);

  return (
    <div className="p-3 bg-muted/40 h-full flex min-h-0">
      <div className="w-1/2 flex flex-col p-5 gap-5">
        {/* <div className="text-2xl flex items-center gap-2">봇과의 대결</div> */}
        <div className="flex-1 min-h-0">
          <div className="h-full w-full bg-background border border-border rounded-xl">
            {!started ? <GameSetting /> : <Game />}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5 pt-3 gap-5">
        <div className="text-2xl flex items-center gap-2">대결 기록</div>
        <div className="flex-1 min-h-0"></div>
      </div>
    </div>
  );
}
