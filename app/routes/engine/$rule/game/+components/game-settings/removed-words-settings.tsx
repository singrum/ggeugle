import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useWcStore, useWcStoreApi } from "~/stores/wc-store-provider";

export default function RemovedWordsSettings() {
  const removedWords = useWcStore((e) => e.gameSettingsInfo.removedWords);
  const storeApi = useWcStoreApi();
  return (
    <Label className="flex flex-col gap-4 items-start p-2">
      <div>제외할 단어(공백으로 구분)</div>
      <Textarea
        value={removedWords}
        placeholder="제외할 단어들을 입력하세요"
        onChange={(e) =>
          storeApi.setState((state) => {
            state.gameSettingsInfo.removedWords = e.target.value;
          })
        }
      />
    </Label>
  );
}
