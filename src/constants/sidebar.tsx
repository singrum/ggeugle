import KnowledgePage from "@/app/knowledge/knowledge-page";
import KnowledgeSidebar from "@/app/knowledge/knowledge-sidebar";
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
  SlidersHorizontalIcon,
  type Icon,
} from "@phosphor-icons/react";
import { BookMarked, Info, type LucideIcon } from "lucide-react";

import type { ReactNode } from "react";

export type Nav = {
  title: string;
  key: string;
  icon: Icon | LucideIcon;
  component: ReactNode;
  innerSidebarComponent: ReactNode | undefined;
  isMore: boolean;
};

export const navInfo: Nav[] = [
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
    isMore: false,
  },
  {
    title: "게임",
    key: "game",
    icon: ChatsIcon,
    component: <Play />,
    innerSidebarComponent: <PlaySidebar />,
    isMore: false,
  },
  {
    title: "룰 설정",
    key: "rule",
    icon: SlidersHorizontalIcon,
    component: <RuleSettings />,
    innerSidebarComponent: <SampleRuleSidebar />,
    isMore: false,
  },
  {
    title: "지식",
    key: "knowledge",
    icon: BookMarked,
    component: <KnowledgePage />,
    innerSidebarComponent: <KnowledgeSidebar />,
    isMore: true,
  },

  {
    title: "정보",
    key: "info",
    icon: Info,
    component: <More />,
    innerSidebarComponent: undefined,
    isMore: true,
  },
];
