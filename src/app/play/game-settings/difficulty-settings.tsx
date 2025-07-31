import { Toggle } from "@/components/ui/toggle";
import { difficultyInfo } from "@/constants/play";
import { useWcStore } from "@/stores/wc-store";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function DifficultySettings() {
  const difficulty = useWcStore((e) => e.gameSettingsInfo.difficulty);
  return (
    <GameSettingsCard>
      <GameSettingsHead>난이도</GameSettingsHead>
      <GameSettingsContent>
        <div className="flex w-full gap-2">
          {difficultyInfo.map(({ title }, i) => (
            <Toggle
              variant="outline"
              key={title}
              pressed={i === difficulty}
              onPressedChange={() => {
                useWcStore.setState((state) => {
                  state.gameSettingsInfo.difficulty = i as 0 | 1 | 2;
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
