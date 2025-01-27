import { Label } from "@/components/ui/label";
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
import { useWC } from "@/lib/store/useWC";

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
  const [
    applyChan,
    setApplyChan,
    deleteMult,
    setDeleteMult,
    sortBy,
    setSortBy,
  ] = useWC((e) => [
    e.applyChan,
    e.setApplyChan,
    e.deleteMult,
    e.setDeleteMult,
    e.sortBy,
    e.setSortBy,
  ]);

  return (
    <div>
      <div className="flex flex-col mt-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Label className="flex-1 font-medium text-base" htmlFor="applyChan">
              두음 법칙 적용하여 검색
            </Label>
            <div className="">
              <Switch
                id="applyChan"
                onCheckedChange={(e: boolean) => {
                  setApplyChan(e);
                }}
                checked={applyChan}
              />
            </div>
          </div>
          <Separator />
          <div className="flex items-center">
            <Label
              className="flex-1 font-medium text-base"
              htmlFor="deleteMult"
            >
              첫 글자, 끝 글자 중복 제거
            </Label>
            <div className="">
              <Switch
                id="deleteMult"
                onCheckedChange={(e: boolean) => {
                  setDeleteMult(e);
                }}
                checked={deleteMult}
              />
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-1 font-medium text-base">단어 정렬 기준</div>
              <div className="">
                <Select
                  value={sortBy}
                  onValueChange={(value: "0" | "1") => setSortBy(value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">끝 글자 우선</SelectItem>
                    <SelectItem value="1">첫 글자부터</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              {sortBy === "0" ? (
                <>
                  <p>첫 글자 → 끝 글자 → 두 번째 글자 → 세 번째 글자 → ... </p>
                  <p>순으로 사전식 정렬</p>
                </>
              ) : (
                <>
                  <p>첫 글자 → 두 번째 글자 → 세 번째 글자 → ... </p>
                  <p>순으로 사전식 정렬</p>
                </>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center ">
            <Label className="flex-1 font-medium text-base" htmlFor="flip">
              검색 레이아웃 좌우 반전
            </Label>
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
          <div className="flex items-center">
            <Label className="flex-1 font-medium text-base" htmlFor="showToast">
              음절 유형 변경 시 알림
            </Label>
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
          <div className="flex items-center">
            <Label
              className="flex-1 font-medium text-base"
              htmlFor="showAllWords"
            >
              모든 단어 항상 펼치기
            </Label>
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

          <div className="flex items-center">
            <div className="flex-1 font-medium text-base">단어 제외 방법</div>
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
