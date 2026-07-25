import { ChevronDown, MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/components/ui/menubar";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useWcStore } from "~/stores/wc-store-provider";

const toolbarInfo = [
  {
    name: "알고리즘",
    content: <AlgorithmToolbarContent />,
  },
  {
    name: "설정",
    content: <SettingsToolbarContent showPreferenceSettings={true} />,
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
        <Menubar>
          {toolbarInfo.map((item) => (
            <MenubarMenu key={item.name}>
              <MenubarTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm px-3 rounded-md font-normal "
                  size="sm"
                >
                  {item.name}
                  <ChevronDown />
                </Button>
              </MenubarTrigger>
              <MenubarContent>{item.content}</MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
    </div>
  );
}

export function MiniToolbar() {
  return (
    <Menubar className="">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" size="icon-lg">
            <MoreVertical className="stroke-foreground size-5" />
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>음절 위치</MenubarLabel>
            <div className="p-2">
              <PosSelect />
            </div>
          </MenubarGroup>

          <MenubarSeparator />
          {toolbarInfo.map((item, index) => (
            <Fragment key={item.name}>
              {index > 0 && <MenubarSeparator />}
              {item.content}
            </Fragment>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function PosSelect() {
  const view = useWcStore((e) => e.view);
  const setView = useWcStore((e) => e.setView);

  return (
    <ToggleGroup
      className="rounded-full"
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

export function AlgorithmToolbarContent() {
  const setFlow = useWcStore((e) => e.setFlow);
  const flow = useWcStore((e) => e.flow);

  return (
    <>
      <MenubarGroup>
        <MenubarLabel>알고리즘</MenubarLabel>
        <MenubarSub>
          <MenubarSubTrigger>음절 분류 절차</MenubarSubTrigger>
          <MenubarPortal>
            <MenubarSubContent>
              <MenubarRadioGroup value={flow === 0 ? "minimize" : "maximize"}>
                <MenubarRadioItem value="minimize" onClick={() => setFlow(0)}>
                  돌림 단어 최소화
                </MenubarRadioItem>
                <MenubarRadioItem value="maximize" onClick={() => setFlow(1)}>
                  돌림 단어 최대화
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarPortal>
        </MenubarSub>

        <MenubarItem
          onClick={() =>
            document
              .getElementById("search-precedence-settings-trigger")
              ?.click()
          }
        >
          전략 탐색 우선순위 편집
        </MenubarItem>
      </MenubarGroup>
    </>
  );
}

export function SettingsToolbarContent({
  showPreferenceSettings,
}: {
  showPreferenceSettings?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <MenubarGroup>
      <MenubarLabel>설정</MenubarLabel>

      {showPreferenceSettings && (
        <MenubarItem
          onClick={() =>
            document.getElementById("preference-settings-trigger")?.click()
          }
        >
          환경 설정
        </MenubarItem>
      )}

      <MenubarSub>
        <MenubarSubTrigger>테마</MenubarSubTrigger>
        <MenubarPortal>
          <MenubarSubContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">라이트</MenubarRadioItem>
              <MenubarRadioItem value="dark">다크</MenubarRadioItem>
              <MenubarRadioItem value="system">시스템</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarSubContent>
        </MenubarPortal>
      </MenubarSub>
    </MenubarGroup>
  );
}
export function HelpToolbarContent() {
  const items = [
    { title: "지식", url: "/knowledge" },
    {
      title: "자주 묻는 질문",
      url: `/knowledge/${encodeURIComponent("자주 묻는 질문")}`,
    },
  ];
  return (
    <MenubarGroup>
      <MenubarLabel>도움말</MenubarLabel>
      {items.map(({ title, url }) => (
        <MenubarItem key={title} asChild>
          <Link to={url}>{title}</Link>
        </MenubarItem>
      ))}
    </MenubarGroup>
  );
}

export function InfoToolbarContent() {
  const items = [
    { title: "이끼", url: "https://ikki.app" },
    { title: "깃허브", url: "https://github.com/singrum/ggeugle" },
    {
      title: "디스코드",
      url: "https://discord.gg/bkHgyajx89",
    },
  ];
  return (
    <MenubarGroup>
      <MenubarLabel>바로 가기</MenubarLabel>
      {items.map(({ title, url }) => (
        <MenubarItem key={title} asChild>
          <Link to={url} target="_blank" rel="noopener noreferrer">
            {title}
          </Link>
        </MenubarItem>
      ))}
    </MenubarGroup>
  );
}
