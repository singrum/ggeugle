import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useWcStore, useWcStoreApi } from "~/stores/wc-store-provider";
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
  const storeApi = useWcStoreApi();
  return (
    <Label>
      <GameSettingsCard>
        <GameSettingsHead>컴퓨터 생각 시간</GameSettingsHead>
        <GameSettingsContent>
          <div className="flex items-center gap-2">
            <Input
              className="w-25 text-right"
              disabled={difficulty !== 2}
              type="number"
              value={calculatingDuration}
              onChange={(e) => {
                storeApi.setState((state) => {
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
