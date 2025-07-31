import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWcStore } from "@/stores/wc-store";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function CalculatingDurationSettings() {
  const calculatingDuration = useWcStore(
    (e) => e.gameSettingsInfo.calculatingDuration,
  );
  const difficulty = useWcStore((e) => e.gameSettingsInfo.difficulty);
  return (
    <Label>
      <GameSettingsCard>
        <GameSettingsHead>컴퓨터 생각 시간</GameSettingsHead>
        <GameSettingsContent>
          <div className="flex items-center gap-2">
            <Input
              className="w-[100px] text-right"
              disabled={difficulty !== 2}
              type="number"
              value={calculatingDuration}
              onChange={(e) => {
                useWcStore.setState((state) => {
                  state.gameSettingsInfo.calculatingDuration = Number(
                    e.target.value,
                  );
                });
              }}
            />
            초
          </div>
        </GameSettingsContent>
      </GameSettingsCard>
    </Label>
  );
}
