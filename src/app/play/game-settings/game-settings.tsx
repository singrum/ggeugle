import { Button } from "@/components/ui/button";
import { useWcStore } from "@/stores/wc-store";
import { Inbox, Loader } from "lucide-react";

import { useIsTablet } from "@/hooks/use-tablet";
import CalculatingDurationSettings from "./calculating-duration-settings";
import DifficultySettings from "./difficulty-settings";
import FirstTurnSettings from "./first-turn-settings";
import GameSettingsList from "./game-settings-list";
import StealableSettings from "./stealable-settings";

export default function GameSettings() {
  const originalSolver = useWcStore((e) => e.originalSolver);
  const makeGame = useWcStore((e) => e.makeGame);
  const isTablet = useIsTablet();

  const setOpen = useWcStore((e) => e.setPlayDrawerOpen);
  return (
    <div className="relative mx-auto flex h-full w-full max-w-screen-sm flex-col px-4 py-4 md:px-12 lg:py-6">
      <div className="flex items-center justify-between">
        <h1 className="mx-2 text-xl font-semibold lg:text-2xl">게임 설정</h1>
        {isTablet && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(true)}
            className="dark:bg-accent/50 size-11 rounded-full shadow-md"
          >
            <Inbox className="stroke-foreground size-5" />
          </Button>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center">
        <GameSettingsList>
          <DifficultySettings />

          <FirstTurnSettings />

          <CalculatingDurationSettings />

          <StealableSettings />
        </GameSettingsList>
      </div>

      <Button
        className="h-14 w-full rounded-full px-4 text-base"
        disabled={
          !originalSolver ||
          (originalSolver && originalSolver.graphSolver.graphs.isEmpty())
        }
        onClick={() => {
          makeGame();
        }}
      >
        {originalSolver ? (
          "게임 시작"
        ) : (
          <Loader className="stroke-primary-foreground size-5 animate-spin" />
        )}
      </Button>
    </div>
  );
}
