import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { strengths, turns, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import React from "react";
import { BsCpuFill } from "react-icons/bs";

export default function GameSetting() {
  const [strength, setStrength, turnForm, setTurnForm, setStarted] = useWC(
    (e) => [e.strength, e.setStrength, e.turnForm, e.setTurnForm, e.setStarted]
  );

  return (
    <div className="flex flex-col items-center p-3 h-full justify-between">
      <div className="flex-1 flex flex-col justify-center w-full items-center gap-8">
        <div className="text-xl">게임 설정</div>
        <div className="rounded-lg p-2 flex items-center justify-center ">
          <BsCpuFill
            className={`w-40 h-40 transition-colors duration-200 ${strengths[strength].color}`}
          />
        </div>
        <div className="flex flex-col items-center gap-3 w-1/2">
          <div>{strengths[strength].name}</div>
          <Slider
            onValueChange={(e) => setStrength(e[0])}
            value={[strength]}
            max={2}
            step={1}
            className={cn("w-full")}
          />
        </div>
        <div className="flex gap-4">
          {turns.map((e, i) => (
            <div
              key={i}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-md border border-border transition-colors hover:bg-accent cursor-pointer text-muted-foreground hover:text-foreground",
                { "text-foreground ring-2 ring-ring": turnForm === i }
              )}
              onClick={() => {
                setTurnForm(i);
              }}
            >
              {e}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-12">
        <Button
          className="w-full h-full text-md"
          onClick={() => setStarted(true)}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
