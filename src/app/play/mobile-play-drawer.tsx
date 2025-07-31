import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useWcStore } from "@/stores/wc-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import GameList from "./play-sidebar/game-list";
import SidebarHeader from "./play-sidebar/sidebar-header";
export default function MobileGameListTrigger() {
  const open = useWcStore((e) => e.playDrawerOpen);
  const setOpen = useWcStore((e) => e.setPlayDrawerOpen);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-full">
        <DrawerHeader className="p-0">
          <VisuallyHidden>
            <DrawerTitle>게임 리스트</DrawerTitle>
            <DrawerDescription>게임 리스트입니다.</DrawerDescription>
          </VisuallyHidden>
          <SidebarHeader />
        </DrawerHeader>
        <div className="h-full overflow-auto py-2">
          <GameList />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
