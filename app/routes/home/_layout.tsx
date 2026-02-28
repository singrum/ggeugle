import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { useIsTablet } from "~/hooks/use-tablet";
import { cn } from "~/lib/utils";
import MobileHeader from "./+components/sidebar/mobile-header";
import MobileNav from "./+components/sidebar/mobile-nav";
import Sidebar from "./+components/sidebar/sidebar";

export default function Index() {
  const isTablet = useIsTablet();
  return (
    <div className="bg-sidebar">
      <div
        className={cn("min-h-svh lg:h-svh flex relative", {
          "flex-col h-svh": isTablet,
        })}
      >
        <Toaster position="top-right" />
        {!isTablet ? (
          <>
            <Sidebar />
            <Outlet />
          </>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-auto">
              <MobileHeader />
              <Outlet />
            </div>
            <MobileNav />
          </>
        )}
      </div>
    </div>
  );
}
