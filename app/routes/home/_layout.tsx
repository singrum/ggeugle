import { Outlet } from "react-router";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import Header from "./+components/header/header";
import Sidebar from "./+components/sidebar/sidebar";

export default function Index() {
  return (
    <div className="[--header-height:calc(--spacing(14))] bg-sidebar">
      <Header />
      <div className="h-[calc(100svh-var(--header-height))] flex">
        <Sidebar />
        <div className="pr-2 pb-2 flex-1 h-full">
          <Card className="rounded-lg h-full p-0 overflow-hidden bg-background border dark:border-0">
            <ScrollArea className="h-full">
              <Outlet />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
