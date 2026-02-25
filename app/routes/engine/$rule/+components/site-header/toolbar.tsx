import { ChevronDown, MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useWcStore } from "~/stores/wc-store";
import PreferenceSettingsTrigger from "./preference-settings";
import SearchPrecedenceSettingsTrigger from "./search-precedence-settings";

const toolbarInfo = [
  {
    name: "알고리즘",
    content: <AlgorithmToolbarContent />,
  },
  {
    name: "설정",
    content: <SettingsToolbarContent />,
  },
  {
    name: "도움말",
    content: <HelpToolbarContent />,
  },
  {
    name: "바로가기",
    content: <InfoToolbarContent />,
  },
];

export function Toolbar() {
  return (
    <div className="flex gap-2 items-center">
      <PosSelect />
      <div className="flex gap-0">
        {toolbarInfo.map((item) => (
          <DropdownMenu key={item.name}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm px-3 rounded-md font-normal "
                size="sm"
              >
                {item.name}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>{item.content}</DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
}

export function MiniToolbar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>음절 위치</DropdownMenuLabel>
          <div className="p-2">
            <PosSelect />
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        {toolbarInfo.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && <DropdownMenuSeparator />}
            {item.content}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PosSelect() {
  const view = useWcStore((e) => e.view);
  const setView = useWcStore((e) => e.setView);

  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      value={`${view}`}
      onValueChange={(value) => {
        if (value) {
          setView(parseInt(value) as 0 | 1);
        }
      }}
    >
      <ToggleGroupItem value="0" className="data-[state=on]:bg-foreground/10">
        첫 글자
      </ToggleGroupItem>
      <ToggleGroupItem value="1" className="data-[state=on]:bg-foreground/10">
        끝 글자
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function AlgorithmToolbarContent() {
  const setFlow = useWcStore((e) => e.setFlow);
  const flow = useWcStore((e) => e.flow);
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>알고리즘</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>돌림 단어 최소/최대화</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={flow === 0 ? "minimize" : "maximize"}
              >
                <DropdownMenuRadioItem
                  value="minimize"
                  onClick={() => setFlow(0)}
                >
                  최소화
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="maximize"
                  onClick={() => setFlow(1)}
                >
                  최대화
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <SearchPrecedenceSettingsTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            우선 순위 설정
          </DropdownMenuItem>
        </SearchPrecedenceSettingsTrigger>
      </DropdownMenuGroup>
    </>
  );
}

function SettingsToolbarContent() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>설정</DropdownMenuLabel>
      <PreferenceSettingsTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          환경 설정
        </DropdownMenuItem>
      </PreferenceSettingsTrigger>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>테마</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                라이트
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">다크</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                시스템
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
function HelpToolbarContent() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>도움말</DropdownMenuLabel>
      <DropdownMenuItem>지식</DropdownMenuItem>
      <DropdownMenuItem>FAQ</DropdownMenuItem>
      <DropdownMenuItem>피드백</DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

function InfoToolbarContent() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>바로 가기</DropdownMenuLabel>
      <DropdownMenuItem>이끼</DropdownMenuItem>
      <DropdownMenuItem>깃허브</DropdownMenuItem>
      <DropdownMenuItem>디스코드</DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
