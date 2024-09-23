import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { strengths, turns, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { RiRobot2Fill } from "react-icons/ri";
export default function GameSetting() {
  const [gameSettingForm, setGameSettingForm, getStarted] = useWC((e) => [
    e.gameSettingForm,
    e.setGameSettingForm,
    e.getStarted,
  ]);

  return (
    <div className="flex flex-col items-center h-full justify-between rounded-xl bg-muted/40">
      <div className="flex-1 flex flex-col justify-start w-full items-center">
        <div className="w-full flex items-center px-2 py-1 justify-between border-b border-border text-accent-foreground">
          <div className="flex items-center gap-1 px-2 py-2 font-semibold ">
            게임 설정
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1 w-full p-4 pb-0">
          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1 flex flex-col w-full justify-center items-center">
              <div className="flex flex-col justify-center gap-3 mb-10 w-1/2">
                <div className="p-2 flex items-center justify-center gap-2">
                  <div className="font-semibold text-sm">난이도 :</div>
                  <div
                    className={`${
                      strengths[gameSettingForm.strength].color
                    } flex gap-1 items-center font-semibold text-sm`}
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
              <div className="flex gap-4 font-semibold text-sm mb-10">
                {turns.map((e, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-md border border-border transition-colors hover:bg-accent cursor-pointer text-muted-foreground hover:text-foreground",
                      {
                        "text-foreground ring-2 ring-ring":
                          gameSettingForm.turn === i,
                        "hover:bg-background hover:text-auto opacity-50 cursor-not-allowed":
                          !gameSettingForm.steal,
                      }
                    )}
                    onClick={() => {
                      if (gameSettingForm.steal) {
                        setGameSettingForm({
                          ...gameSettingForm,

                          turn: i as 0 | 1 | 2,
                        });
                      }
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col">
              <Separator />

              <div className="pt-6 pb-2 px-2">
                <div className="flex items-center space-x-2 pb-6 justify-between gap-4">
                  <Label htmlFor="steal w-full">
                    <div className="mb-2">첫 수 단어 뺏기</div>
                    <div className="font-normal text-muted-foreground leading-snug text-xs">
                      후공은 선공이 맨 처음 말한 단어를 빼앗을 수 있습니다.
                    </div>
                  </Label>
                  <Switch
                    id="steal"
                    checked={gameSettingForm.steal}
                    onCheckedChange={(e) =>
                      setGameSettingForm({
                        ...gameSettingForm,

                        steal: e as boolean,
                        ...(e === false ? { turn: 0 } : {}),
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 justify-between gap-4">
                  <Label htmlFor="debug-mode" className="w-full">
                    <div className="mb-2">디버그 모드</div>
                    <div className="font-normal text-muted-foreground leading-snug text-xs">
                      디버그 모드를 사용합니다.
                    </div>
                  </Label>
                  <Switch
                    id="debug-mode"
                    checked={gameSettingForm.debug}
                    onCheckedChange={(e) =>
                      setGameSettingForm({
                        ...gameSettingForm,
                        debug: e as boolean,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-20 p-4">
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
