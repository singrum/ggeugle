import { ChatsIcon, HouseIcon, type Icon } from "@phosphor-icons/react";
import { type LucideIcon } from "lucide-react";

import type { ReactNode } from "react";
import CharListSidebar from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-list-sidebar";
import MobileCharMenu from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-menu";

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
    title: "검색",
    key: "search",
    icon: HouseIcon,
    component: null,
    innerSidebarComponent: (
      <>
        <MobileCharMenu className="sticky top-0 z-20" />
        <CharListSidebar />
      </>
    ),
    isMore: false,
  },
  {
    title: "게임",
    key: "game",
    icon: ChatsIcon,
    component: null,
    innerSidebarComponent: null,
    isMore: false,
  },
];
