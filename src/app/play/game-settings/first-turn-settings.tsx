import { Toggle } from "@/components/ui/toggle";
import { firstTurnFormInfo } from "@/constants/play";
import { useWcStore } from "@/stores/wc-store";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function FirstTurnSettings() {
  const first = useWcStore((e) => e.gameSettingsInfo.firstTurnForm);
  const stealable = useWcStore((e) => e.gameSettingsInfo.stealable);
  return (
    <GameSettingsCard>
      <GameSettingsHead>내 차례</GameSettingsHead>
      <GameSettingsContent>
        <div className="flex gap-2">
          {firstTurnFormInfo.map(({ title }, i) => (
            <Toggle
              variant="outline"
              key={title}
              pressed={i === first}
              disabled={!stealable}
              onPressedChange={() => {
                useWcStore.setState((state) => {
                  state.gameSettingsInfo.firstTurnForm = i;
                });
              }}
            >
              {title}
            </Toggle>
          ))}
        </div>
      </GameSettingsContent>
    </GameSettingsCard>
  );
}
