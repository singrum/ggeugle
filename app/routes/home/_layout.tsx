import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import MobileHeader from "./+components/sidebar/mobile-header";
import MobileNav from "./+components/sidebar/mobile-nav";
import Sidebar from "./+components/sidebar/sidebar";

export default function HomeLayout() {
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem("last_home_path", location.pathname);
  }, []);
  return (
    <div className="bg-background lg:bg-sidebar lg:h-svh">
      <div className="min-h-svh relative flex-col lg:flex-row h-svh lg:h-full hidden lg:flex">
        <Toaster position="top-right" />

        <Sidebar />
        <Outlet />
      </div>
      <div className="min-h-svh flex relative flex-col lg:flex-row h-svh lg:h-full lg:hidden">
        <Toaster position="top-right" />

        <div className="flex-1 min-h-0 overflow-auto">
          <MobileHeader />
          <Outlet />
        </div>
        <MobileNav />
      </div>
    </div>
  );
}
