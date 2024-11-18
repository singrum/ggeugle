import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCookieSettings } from "@/lib/store/useCookieSettings";

export default function PreferenceSetting() {
  const [
    isSearchFlip,
    setIsSearchFlip,
    showToast,
    setShowToast,
    exceptBy,
    setExceptBy,
    showAllWords,
    setShowAllWords,
  ] = useCookieSettings((e) => [
    e.isSearchFlip,
    e.setIsSearchFlip,
    e.showToast,
    e.setShowToast,
    e.exceptBy,
    e.setExceptBy,
    e.showAllWords,
    e.setShowAllWords,
  ]);

  return (
    <div>
      <div className="flex flex-col mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex">
            <div className="flex-1 font-semibold">검색 레이아웃 좌우 반전</div>
            <div className="">
              <Switch
                id="flip"
                onCheckedChange={(e: boolean) => {
                  setIsSearchFlip(e);
                }}
                checked={isSearchFlip}
              />
            </div>
          </div>
          <Separator />
          <div className="flex">
            <div className="flex-1 font-semibold">글자 유형 변경 시 알림</div>
            <div className="">
              <Switch
                id="showToast"
                onCheckedChange={(e: boolean) => {
                  setShowToast(e);
                }}
                checked={showToast}
              />
            </div>
          </div>
          <Separator />
          <div className="flex">
            <div className="flex-1 font-semibold">모든 단어 항상 펼치기</div>
            <div className="">
              <Switch
                id="showAllWords"
                onCheckedChange={(e: boolean) => {
                  setShowAllWords(e);
                }}
                checked={showAllWords}
              />
            </div>
          </div>
          <Separator />
          <div className="flex">
            <div className="flex-1 font-semibold">단어 제외 방법</div>
            <div className="">
              <Select
                value={exceptBy}
                onValueChange={(value: "space" | "enter") => setExceptBy(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="space">띄어쓰기</SelectItem>
                  <SelectItem value="enter">엔터</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
