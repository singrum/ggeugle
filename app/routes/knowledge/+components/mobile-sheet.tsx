import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet";
import Nav from "./nav";

export default function MobileSheet() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="stroke-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader />
        <div className="p-2 flex-1 min-h-0 overflow-auto">
          <Nav onItemClick={() => setOpen(false)} />
        </div>
        <SheetFooter className="">
          <Button variant="secondary" asChild>
            <Link to="/home">엔진 홈</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
