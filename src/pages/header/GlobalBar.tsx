import { Button } from "@/components/ui/button";
import { Settings, Settings2 } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { RuleSetting } from "./RuleSetting";
export default function GlobalBar() {
  return (
    <div className="flex gap-1">
      <RuleSetting />
      <PreferenceSetting />
    </div>
  );
}

function PreferenceSetting() {
  const theme = useTheme();
  const [themeSelect, setThemeSelect] = useState<"dark" | "light" | "system">(
    theme.theme
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant={"ghost"}>
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>환경 설정</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              테마
            </Label>
            <ThemeDropdown
              themeSelect={themeSelect}
              setThemeSelect={setThemeSelect}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" id="close">
              취소
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => {
              document.getElementById("close")!.click();
              theme.setTheme(themeSelect);
            }}
          >
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function ThemeDropdown({
  themeSelect,
  setThemeSelect,
}: {
  themeSelect: string;
  setThemeSelect: React.Dispatch<
    React.SetStateAction<"dark" | "light" | "system">
  >;
}) {
  return (
    <Select
      onValueChange={(e: "dark" | "light" | "system") => {
        setThemeSelect(e);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={
            themeSelect === "system"
              ? "자동"
              : themeSelect === "light"
              ? "밝음"
              : "어두움"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="system">자동</SelectItem>
          <SelectItem value="light">밝음</SelectItem>
          <SelectItem value="dark">어두움</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
