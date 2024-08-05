import { useTheme } from "@/components/theme-provider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { SettnigMenu } from "./SettingMenu";
import { useWC } from "@/lib/store/useWC";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PreferenceSetting() {
  const [isAutoExcept, setIsAutoExcept] = useWC((e) => [
    e.isAutoExcept,
    e.setIsAutoExcept,
  ]);

  return (
    <div>
      <div className="flex flex-col">
        <SettnigMenu name="테마">
          <ThemeDropdown />
        </SettnigMenu>
        <Separator className="my-4" />
        <SettnigMenu name="단어 클릭 시 금지단어에 추가">
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
