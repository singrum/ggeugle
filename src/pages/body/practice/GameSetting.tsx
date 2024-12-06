import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { strengths, turns, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { RiRobot2Fill } from "react-icons/ri";
export default function GameSetting() {
  const [
    originalEngine,
    engine,
    gameSettingForm,
    setGameSettingForm,
    getStarted,
  ] = useWC((e) => [
    e.originalEngine,
    e.engine,
    e.gameSettingForm,
    e.setGameSettingForm,
    e.getStarted,
  ]);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    if (engine && pending) {
      console.log(engine);
      setPending(false);
      getStarted();
    }
  }, [engine]);
  return (
    <div className="flex flex-col items-center min-h-full justify-between rounded-xl bg-muted/40">
      <div className="flex-1 flex flex-col justify-start w-full items-center">
        <div className="w-full flex items-center px-2 py-1 justify-between border-b border-border text-accent-foreground">
          <div className="flex items-center gap-1 px-2 py-2 font-semibold ">
            게임 설정
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1 w-full p-4 pb-0">
          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1 flex flex-col w-full justify-center items-center">
              <div className="flex flex-col justify-center gap-3 mb-10 w-fit">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-semibold text-sm flex justify-between items-center text-muted-foreground">
                      <div>난이도</div>
                    </div>
                    <div className="flex justify-start">
                      <Select
                        value={`${gameSettingForm.strength}`}
                        onValueChange={(e) =>
                          setGameSettingForm({
                            ...gameSettingForm,
                            strength: parseInt(e) as 0 | 1 | 2,
                          })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2].map((e) => (
                            <SelectItem
                              className="text-xs"
                              value={`${e}`}
                              key={e}
                            >
                              <div
                                className={`${strengths[e].color} flex gap-1 items-center font-semibold text-sm`}
                              >
                                <RiRobot2Fill className="h-5 w-5" />
                                {strengths[e].name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-semibold text-sm flex justify-between items-center text-muted-foreground">
                      <div>계산 시간</div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Input
                        disabled={gameSettingForm.strength !== 2}
                        id="calc-time-input"
                        type="number"
                        onChange={(e) =>
                          setGameSettingForm({
                            ...gameSettingForm,
                            calcTime: parseFloat(e.target.value),
                          })
                        }
                        value={gameSettingForm.calcTime}
                        className="w-[75px] text-right"
                      />
                      <div
                        className={cn({
                          "text-muted-foreground":
                            gameSettingForm.strength !== 2,
                        })}
                      >
                        초
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-semibold text-sm flex justify-between items-center text-muted-foreground">
                      <div>내 차례</div>
                    </div>
                    <div className="flex gap-4">
                      {turns.map((e, i) => (
                        <button
                          key={i}
                          className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-md border border-border transition-colors bg-background  cursor-pointer text-muted-foreground hover:text-foreground select-none font-semibold text-sm",
                            {
                              "text-foreground ring-2 ring-ring ring-offset-2":
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
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <Separator />

              <div className="pt-6 pb-2 px-2">
                <div className="flex items-center space-x-2 pb-6 justify-between gap-4">
                  <Label htmlFor="steal" className="w-full">
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

      <div className="flex items-center justify-center w-full p-4">
        <Button
          className="w-full text-md h-12"
          disabled={originalEngine && originalEngine.words.length === 0}
          onClick={() => {
            if (!engine) {
              setPending(true);
            } else {
              getStarted();
            }
          }}
        >
          {pending ? (
            <div className="flex gap-2 px-2 py-1.5">
              <LoaderCircle className="ml-1 w-6 h-6 animate-spin text-background" />
            </div>
          ) : (
            "게임 시작"
          )}
        </Button>
      </div>
    </div>
  );
}
