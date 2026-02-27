import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import MobileHeader from "./+components/sidebar/mobile-header";
import MobileNav from "./+components/sidebar/mobile-nav";
import Sidebar from "./+components/sidebar/sidebar";

export default function Index() {
  const isMobile = useIsMobile();
  return (
    <div className="sm:bg-sidebar">
      <div
        className={cn("min-h-svh md:h-svh flex relative", {
          "flex-col": isMobile,
        })}
      >
        <Toaster position="top-right" />
        {!isMobile ? (
          <>
            <Sidebar />
            <Outlet />
          </>
        ) : (
          <>
            <MobileHeader />
            <Outlet />
            <MobileNav />
          </>
        )}
      </div>
    </div>
  );
}
