import More from "@/app/more/more";
import Play from "@/app/play/play";
import PlaySidebar from "@/app/play/play-sidebar/play-sidebar";
import RuleSettings from "@/app/rule-setttings/rule-settings";
import SampleRuleSidebar from "@/app/rule-setttings/sample-rules/sample-rule-sidebar";
import CharListSidebar from "@/app/search/char-list-sidebar/char-list-sidebar";
import CharMenu from "@/app/search/char-list-sidebar/char-menu";
import Search from "@/app/search/search";
import {
  ChatsIcon,
  HouseIcon,
  InfoIcon,
  SlidersHorizontalIcon,
  type Icon,
} from "@phosphor-icons/react";

import type { ReactNode } from "react";

export const navInfo: {
  title: string;
  key: string;
  icon: Icon;
  component: ReactNode;
  innerSidebarComponent: ReactNode | undefined;
}[] = [
  {
    title: "홈",
    key: "home",
    icon: HouseIcon,
    component: <Search />,
    innerSidebarComponent: (
      <>
        <CharMenu className="sticky top-0 z-20" />
        <CharListSidebar />
      </>
    ),
  },
  {
    title: "게임",
    key: "game",
    icon: ChatsIcon,
    component: <Play />,
    innerSidebarComponent: <PlaySidebar />,
  },
  {
    title: "룰 설정",
    key: "rule",
    icon: SlidersHorizontalIcon,
    component: <RuleSettings />,
    innerSidebarComponent: <SampleRuleSidebar />,
  },
  {
    title: "정보",
    key: "info",
    icon: InfoIcon,
    component: <More />,
    innerSidebarComponent: undefined,
  },
];
