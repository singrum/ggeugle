import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useWcStore } from "@/stores/wc-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import CharListSidebar from "./char-list-sidebar";
import MobileCharMenu from "./mobile-char-menu";

export default function MobileCharListTrigger() {
  const open = useWcStore((e) => e.charListDrawerOpen);
  const setOpen = useWcStore((e) => e.setCharListDrawerOpen);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-16 rounded-xl text-lg shadow-sm backdrop-blur-2xl"
        >
          <Menu className="stroke-muted-foreground size-6 stroke-[2.5]" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader className="px-0 pt-0 pb-0">
          <VisuallyHidden>
            <DrawerTitle>음절 목록</DrawerTitle>
            <DrawerDescription>
              승리, 패배, 순환, 루트 음절 목록입니다.
            </DrawerDescription>
          </VisuallyHidden>
          <MobileCharMenu className="mt-4" />
        </DrawerHeader>

        <div className="h-full overflow-auto">
          <CharListSidebar />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
