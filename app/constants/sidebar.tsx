import {
  ChatsIcon,
  MagnifyingGlassIcon,
  type Icon,
} from "@phosphor-icons/react";
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
    icon: MagnifyingGlassIcon,
  },
  {
    title: "게임",
    key: "game",
    icon: ChatsIcon,
  },
];
