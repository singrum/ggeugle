import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"; // toggle-group 임포트
import { firstTurnFormInfo } from "~/constants/play";
import { useWcStore } from "~/stores/wc-store";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function FirstTurnSettings() {
  const first = useWcStore((e) => e.gameSettingsInfo.firstTurnForm);
  const stealable = useWcStore((e) => e.gameSettingsInfo.stealable);

  const handleValueChange = (value: string) => {
    // 선택 해제 방지 및 상태 업데이트
    if (value) {
      useWcStore.setState((state) => {
        state.gameSettingsInfo.firstTurnForm = parseInt(value);
      });
    }
  };

  return (
    <GameSettingsCard>
      <GameSettingsHead>내 차례</GameSettingsHead>
      <GameSettingsContent>
        <ToggleGroup
          type="single"
          variant="outline"
          value={first.toString()}
          onValueChange={handleValueChange}
          disabled={!stealable} // 그룹 전체 비활성화 처리
        >
          {firstTurnFormInfo.map(({ title }, i) => (
            <ToggleGroupItem
              key={title}
              value={i.toString()}
              aria-label={title}
            >
              {title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </GameSettingsContent>
    </GameSettingsCard>
  );
}
