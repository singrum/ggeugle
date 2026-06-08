import { BookIcon, FolderIcon } from "@phosphor-icons/react";
import { useLocation } from "react-router";
import MoreTrigger from "../more-trigger";
import Header from "./header";
import Nav from "./nav";

const sidebarItems = [
  { name: "기본 룰", path: "/home/sample", iconName: BookIcon },
  { name: "보관함", path: "/home/storage", iconName: FolderIcon },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="h-full w-64 flex flex-col justify-between">
      <div>
        <Header />
        <Nav />
      </div>
      <div className="p-2">
        <MoreTrigger />
      </div>
    </div>
  );
}
