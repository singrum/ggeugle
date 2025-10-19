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
import { BookText } from "lucide-react";
import SampleRuleSidebar from "./sample-rule-sidebar";
export default function MobileSampleRulesTrigger() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="withHeader" className="size-11" size={"icon"}>
          <BookText className="stroke-foreground size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pt-0">
          <VisuallyHidden>
            <DrawerTitle>빠른 설정</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </VisuallyHidden>
        </DrawerHeader>
        <div className="h-full overflow-auto">
          <SampleRuleSidebar className="pt-0" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
