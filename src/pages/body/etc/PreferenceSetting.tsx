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
    e.isAutoExcept,
    e.setIsAutoExcept,
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
        <SettnigMenu name="테마">
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
        <Separator className="my-4" />
        <SettnigMenu name="단어 클릭 시 제외 단어에 추가">
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
        <Separator className="my-4" />
        <SettnigMenu name="검색 레이아웃 좌우반전">
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
        <Separator className="my-4" />
        <SettnigMenu name="글자 유형 변경 시 알림">
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
        <Separator className="my-4" />
        <SettnigMenu name="제외 단어에 추가하기">
          <Select
            value={exceptBy}
            onValueChange={(value: "space" | "enter") => setExceptBy(value)}
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="space">공백(스페이스)으로 추가</SelectItem>
              <SelectItem value="enter">엔터로 추가</SelectItem>
            </SelectContent>
          </Select>
        </SettnigMenu>
      </div>
    </div>
  );
}
function ThemeDropdown() {
  const theme = useTheme();
  return (
    <Select
      defaultValue={theme.theme}
      onValueChange={(e: "dark" | "light" | "system") => {
        theme.setTheme(e);
      }}
    >
      <SelectTrigger className="w-[180px] text-xs h-fit focus:ring-offset-1 focus:ring-1 ">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className="text-xs" value="system">
            자동
          </SelectItem>
          <SelectItem className="text-xs" value="light">
            밝음
          </SelectItem>
          <SelectItem className="text-xs" value="dark">
            어두움
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
