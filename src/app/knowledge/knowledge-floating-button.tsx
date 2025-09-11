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

import { Button } from "@/components/ui/button";
import KnowledgeSidebar from "./knowledge-sidebar";

export default function KnowledgeFloatingButton() {
  const open = useWcStore((e) => e.knowledgeMenuOpen);
  const setOpen = useWcStore((e) => e.setKnowledgeMenuOpen);
  return (
    <div className="fixed right-2 bottom-18 z-20 flex items-end gap-2">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="size-16 rounded-xl text-lg shadow-sm backdrop-blur-2xl"
          >
            <Menu className="stroke-muted-foreground size-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full">
          <DrawerHeader>
            <DrawerTitle className="text-left">목차</DrawerTitle>
            <VisuallyHidden>
              <DrawerDescription></DrawerDescription>
            </VisuallyHidden>
          </DrawerHeader>

          <div className="h-full overflow-auto">
            <KnowledgeSidebar />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
