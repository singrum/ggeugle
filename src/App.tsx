import Header from "./pages/header/Header";
import Search from "./pages/body/search/Search";

import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
import { forwardRef, ReactNode, useEffect, useState } from "react";
import { useWC } from "./lib/store/useWC";
import { Button } from "@/components/ui/button";
import { Settings, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useTheme } from "./components/theme-provider";
import { RuleSetting } from "./pages/header/RuleSetting";
import { Separator } from "./components/ui/separator";
import Statistics from "./pages/body/statistics/Statistics";
import Practice from "./pages/body/practice/Practice";
import { Checkbox } from "./components/ui/checkbox";
function App() {
  const menu = useMenu((e) => e.menu);
  const setMenu = useMenu((e) => e.setMenu);

  const updateRule = useWC((e) => e.updateRule);
  useEffect(() => {
    updateRule();
  }, []);
  return (
    <>
      <div className="h-full flex flex-col min-h-0">
        <Header />
        <div className="flex-1 flex min-h-0">
          <div className="flex flex-col h-full items-center border-border border-r prevent-select p-2">
            <div className="flex flex-col gap-1">
              {menus.map((e, i) => (
                <MenuBtn
                  key={i}
                  icon={e.icon}
                  name={e.name}
                  className={cn({
                    "bg-accent text-foreground": menu.index === e.index,
                  })}
                  onClick={() => setMenu(i)}
                />
              ))}
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-1 items-center">
              <RuleSetting />
              <PreferenceSetting />
            </div>
          </div>
          <div className="flex-1 h-full min-h-0">
            {menu.index === 0 ? (
              <Search />
            ) : menu.index === 1 ? (
              <Practice />
            ) : (
              <Statistics />
            )}
          </div>
        </div>
      </div>
    </>
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
        <div
          className={cn(
            "h-12 w-12 flex flex-col justify-center items-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1 transition-colors"
          )}
        >
          <Settings strokeWidth={1.5} />
          <div className="text-[10px]">설정</div>
        </div>
        {/* <MenuBtn icon={<Settings2 strokeWidth={1.5} />} name={"설정"} /> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>환경 설정</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div>테마</div>
            <ThemeDropdown
              themeSelect={themeSelect}
              setThemeSelect={setThemeSelect}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>단어 클릭 시 금지단어에 추가</div>
            <div className="flex items-center space-x-2 ml-2">
              <Checkbox id="autoExcept" />
              <label
                htmlFor="autoExcept"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                사용
              </label>
            </div>
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
      defaultValue={themeSelect}
      onValueChange={(e: "dark" | "light" | "system") => {
        setThemeSelect(e);
      }}
    >
      <SelectTrigger className="w-[180px] text-xs h-fit px-3 py-2 focus:ring-offset-1 focus:ring-1 ml-2">
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

interface MenuBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  name: string;
  className?: string;
}

export function MenuBtn({ icon, name, className, ...props }: MenuBtnProps) {
  return (
    <div
      {...props}
      className={cn(
        "h-12 w-12 flex flex-col justify-center items-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1 transition-colors",
        className
      )}
    >
      {icon}
      <div className="text-[10px]">{name}</div>
    </div>
  );
}

export default App;
