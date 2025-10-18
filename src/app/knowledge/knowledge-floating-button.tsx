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
import { ChevronDown, CornerDownRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UseKnowledgePath } from "@/hooks/use-knowledge-path";
import KnowledgeSidebar from "./knowledge-sidebar";

export default function KnowledgeFloatingButton() {
  const open = useWcStore((e) => e.knowledgeMenuOpen);
  const setOpen = useWcStore((e) => e.setKnowledgeMenuOpen);
  const path = UseKnowledgePath();

  return (
    <div className="bg-background fixed bottom-0 flex w-full gap-2 p-3">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 justify-start px-2 shadow-none has-[>svg]:px-3"
          >
            <div className="flex flex-1 items-center justify-start gap-2">
              <CornerDownRight className="stroke-muted-foreground size-4" />
              {path.at(-1)!}
            </div>
            <ChevronDown />
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
