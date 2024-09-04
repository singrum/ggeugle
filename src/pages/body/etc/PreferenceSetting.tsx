import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { SettnigMenu } from "../setting/SettingMenu";

export default function PreferenceSetting() {
  const theme = useTheme();
  const [
    isAutoExcept,
    setIsAutoExcept,
    isSearchFlip,
    setIsSearchFlip,
    showToast,
    setShowToast,
    exceptBy,
    setExceptBy,
  ] = useCookieSettings((e) => [
    // e.isAutoExcept,
    // e.setIsAutoExcept,
    e.isSearchFlip,
    e.setIsSearchFlip,
    e.showToast,
    e.setShowToast,
    e.exceptBy,
    e.setExceptBy,
  ]);

  return (
    <div>
      <div className="flex flex-col">
        <SettnigMenu name="테마" className="dark:bg-background">
          <div className="flex items-center space-x-2">
            <Switch
              id="theme"
              onCheckedChange={(e: boolean) => {
                theme.setTheme(e ? "dark" : "light");
              }}
              checked={
                (theme.theme === "system"
                  ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                  : theme.theme) === "dark"
              }
            />
            <Label htmlFor="theme">다크모드</Label>
          </div>
        </SettnigMenu>
        <Separator />
        {/* <SettnigMenu
          name="단어 클릭 시 자동 제거"
          className="dark:bg-background"
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="autoExcept"
              onCheckedChange={(e: boolean) => {
                setIsAutoExcept(e);
              }}
              checked={isAutoExcept}
            />
            <Label htmlFor="autoExcept">사용</Label>
          </div>
        </SettnigMenu>
        <Separator /> */}
        <SettnigMenu
          name="검색 레이아웃 좌우반전"
          className="dark:bg-background"
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="flip"
              onCheckedChange={(e: boolean) => {
                setIsSearchFlip(e);
              }}
              checked={isSearchFlip}
            />
            <Label htmlFor="flip">사용</Label>
          </div>
        </SettnigMenu>
        <Separator />
        <SettnigMenu
          name="글자 유형 변경 시 알림"
          className="dark:bg-background"
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="showToast"
              onCheckedChange={(e: boolean) => {
                setShowToast(e);
              }}
              checked={showToast}
            />
            <Label htmlFor="showToast">사용</Label>
          </div>
        </SettnigMenu>
        <Separator />
        <SettnigMenu
          name="제거된 단어에 추가하기"
          className="dark:bg-background"
        >
          <Select
            value={exceptBy}
            onValueChange={(value: "space" | "enter") => setExceptBy(value)}
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="space">띄어쓰기로 추가</SelectItem>
              <SelectItem value="enter">엔터로 추가</SelectItem>
            </SelectContent>
          </Select>
        </SettnigMenu>
      </div>
    </div>
  );
}
