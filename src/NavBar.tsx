import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ellipsis, History, Settings } from "lucide-react";
import React, { ForwardedRef, forwardRef, ReactNode, useState } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { useTheme } from "./components/theme-provider";
import { Checkbox } from "./components/ui/checkbox";
import { Separator } from "./components/ui/separator";
import { useMediaQuery } from "./hooks/use-media-query";
import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
import { RuleSetting } from "./pages/header/RuleSetting";
export default function NavBar() {
  const setMenu = useMenu((e) => e.setMenu);
  const menu = useMenu((e) => e.menu);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <div className="flex md:flex-col gap-1 items-center">
        {menus.map((e, i) => (
          <MenuBtn
            key={i}
            icon={e.icon}
            name={e.name}
            className={cn({
              "bg-accent text-foreground ring-ring ring-1 ring-offset-2 ring-offset-background":
                menu.index === e.index,
            })}
            onClick={() => setMenu(i)}
          />
        ))}
      </div>

      <Separator
        className={cn("mx-2 md:my-2", { "h-12": !isDesktop })}
        orientation={isDesktop ? "horizontal" : "vertical"}
      />
      <div className="flex md:flex-col gap-1 items-center">
        <RuleSetting />
        <PreferenceSetting />
      </div>
      <Separator
        className={cn("mx-2 md:my-2", { "h-12": !isDesktop })}
        orientation={isDesktop ? "horizontal" : "vertical"}
      />
      <div className="flex md:flex-col gap-1 items-center">
        <EtcDropdown />
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
        <MenuBtn icon={<Settings strokeWidth={1.5} />} name={"설정"} />
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

export const MenuBtn = forwardRef(
  (
    { icon, name, className, ...props }: MenuBtnProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
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
);

function EtcDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <MenuBtn icon={<Ellipsis strokeWidth={1.5} />} name={"더보기"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => open("https://singrum.github.io/ggeugle_old")}
        >
          <History className="h-4 w-4" />
          이전 버전 끄글
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open("https://github.com/singrum/ggeugle")}
        >
          <VscGithubInverted size={15} />
          깃허브
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
