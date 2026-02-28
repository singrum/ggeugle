import { ChatsIcon, HouseIcon, type Icon } from "@phosphor-icons/react";
import { type LucideIcon } from "lucide-react";

export type Nav = {
  title: string;
  key: string;
  icon: Icon | LucideIcon;
};

export const navInfo: Nav[] = [
  {
    title: "검색",
    key: "search",
    icon: HouseIcon,
  },
  {
    title: "게임",
    key: "game",
    icon: ChatsIcon,
  },
];
