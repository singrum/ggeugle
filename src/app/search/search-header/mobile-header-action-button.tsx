import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Settings } from "lucide-react";

export default function MobileHeaderActionButton() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"ghost"} size="icon">
          <Settings className="stroke-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <VisuallyHidden>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </VisuallyHidden>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
