import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { difficultyInfo } from "~/constants/play";
import { useWcStore } from "~/stores/wc-store-provider";
import {
  GameSettingsCard,
  GameSettingsContent,
  GameSettingsHead,
} from "./game-settings-form-card";

export default function DifficultySettings() {
  const difficulty = useWcStore((e) => e.gameSettingsInfo.difficulty);
  const handleDifficultyChange = (value: string) => {
    // 값이 없을 경우(이미 선택된 걸 다시 눌렀을 때)를 대비해 조건문 추가
    if (value) {
      useWcStore.setState((state) => {
        state.gameSettingsInfo.difficulty = parseInt(value) as 0 | 1 | 2;
      });
    }
  };
  return (
    <GameSettingsCard>
      <GameSettingsHead>난이도</GameSettingsHead>
      <GameSettingsContent>
        <ToggleGroup
          type="single" // 하나만 선택 가능
          variant="outline"
          value={difficulty.toString()} // 현재 상태를 문자열로 전달
          onValueChange={handleDifficultyChange}
        >
          {difficultyInfo.map(({ title }, i) => (
            <ToggleGroupItem
              key={title}
              value={i.toString()} // 각 아이템의 고유 값 (인덱스)
              aria-label={title}
              className="flex-1" // 버튼들이 너비를 동일하게 가져가도록 설정 (선택사항)
            >
              {title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </GameSettingsContent>
    </GameSettingsCard>
  );
}
