import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWcStore } from "@/stores/wc-store";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function StealableSettings() {
  const steal = useWcStore((e) => e.gameSettingsInfo.stealable);
  return (
    <Label>
      <GameSettingsCard>
        <GameSettingsHead>단어 뺏기 허용</GameSettingsHead>
        <GameSettingsContent>
          <div className="flex items-start gap-3">
            <Switch
              checked={steal}
              onCheckedChange={(e) =>
                useWcStore.setState((state) => {
                  state.gameSettingsInfo.stealable = e as boolean;
                  if (!e) {
                    state.gameSettingsInfo.firstTurnForm = 0;
                  }
                })
              }
            />
          </div>
        </GameSettingsContent>
      </GameSettingsCard>
    </Label>
  );
}
