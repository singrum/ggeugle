import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { strengths, turns, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import React from "react";
import { BsCpuFill } from "react-icons/bs";
import { RiRobot2Fill } from "react-icons/ri";

export default function GameSetting() {
  const [gameSettingForm, setGameSettingForm, getStarted] = useWC((e) => [
    e.gameSettingForm,
    e.setGameSettingForm,
    e.getStarted,
  ]);

  return (
    <div className="flex flex-col items-center p-3 h-full justify-between">
      <div className="flex-1 flex flex-col justify-center w-full items-center gap-8">
        <div className="text-xl font-semibold">게임 설정</div>

        <div className="flex flex-col items-center gap-3 w-1/2">
          <div
            className={`rounded-lg p-2 flex items-center justify-center gap-2`}
          >
            <div>난이도:</div>

            <div
              className={`${
                strengths[gameSettingForm.strength].color
              } flex gap-1 items-center`}
            >
              <RiRobot2Fill className="h-5 w-5" />
              {strengths[gameSettingForm.strength].name}
            </div>
          </div>
          <Slider
            onValueChange={(e) =>
              setGameSettingForm({
                ...gameSettingForm,
                strength: e[0] as 0 | 1 | 2,
              })
            }
            value={[gameSettingForm.strength]}
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
                {
                  "text-foreground ring-2 ring-ring":
                    gameSettingForm.turn === i,
                }
              )}
              onClick={() => {
                setGameSettingForm({
                  ...gameSettingForm,
                  turn: i as 0 | 1 | 2,
                });
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
          onClick={() => {
            getStarted();
          }}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
