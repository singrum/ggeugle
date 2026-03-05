import { ChevronDown, MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router";
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
import { useWcStore } from "~/stores/wc-store-provider";

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
          <MoreVertical className="stroke-foreground size-5" />
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
      <ToggleGroupItem value="0">끝 글자</ToggleGroupItem>
      <ToggleGroupItem value="1">첫 글자</ToggleGroupItem>
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
          <DropdownMenuSubTrigger>음절 분류 절차</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={flow === 0 ? "minimize" : "maximize"}
              >
                <DropdownMenuRadioItem
                  value="minimize"
                  onClick={() => setFlow(0)}
                >
                  돌림 단어 최소화
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="maximize"
                  onClick={() => setFlow(1)}
                >
                  돌림 단어 최대화
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() =>
            document
              .getElementById("search-precedence-settings-trigger")
              ?.click()
          }
        >
          전략 탐색 우선순위 편집
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}

function SettingsToolbarContent() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>설정</DropdownMenuLabel>

      <DropdownMenuItem
        onClick={() =>
          document.getElementById("preference-settings-trigger")?.click()
        }
      >
        환경 설정
      </DropdownMenuItem>

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
  const items = [
    { title: "지식", url: "/knowledge" },
    {
      title: "자주 묻는 질문",
      url: `/knowledge/${encodeURIComponent("자주 묻는 질문")}`,
    },
  ];
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>도움말</DropdownMenuLabel>
      {items.map(({ title, url }) => (
        <DropdownMenuItem key={title} asChild>
          <Link to={url}>{title}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}

function InfoToolbarContent() {
  const items = [
    { title: "이끼", url: "https://ikki.app" },
    { title: "깃허브", url: "https://github.com/singrum/ggeugle" },
    {
      title: "디스코드",
      url: "https://discord.gg/bkHgyajx89",
    },
  ];
  const previousItems = [
    { title: "끝말잇기 엔진 v4", url: "https://v4.engine.ikki.app" },
    { title: "끝말잇기 엔진 v3", url: "https://v3.engine.ikki.app" },
  ];
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>바로 가기</DropdownMenuLabel>
      {items.map(({ title, url }) => (
        <DropdownMenuItem key={title} asChild>
          <Link to={url} target="_blank" rel="noopener noreferrer">
            {title}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>구버전</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              {previousItems.map(({ title, url }) => (
                <DropdownMenuItem key={title} asChild>
                  <Link to={url} target="_blank" rel="noopener noreferrer">
                    {title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
