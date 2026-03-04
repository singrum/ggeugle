import { Outlet } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import MobileHeader from "./+components/sidebar/mobile-header";
import MobileNav from "./+components/sidebar/mobile-nav";
import Sidebar from "./+components/sidebar/sidebar";

export default function HomeLayout() {
  return (
    <div className="bg-background lg:bg-sidebar min-h-dvh lg:h-svh flex lg:min-h-0">
      <div className="relative flex-row h-full hidden lg:flex flex-1">
        <Toaster position="top-right" />
        <Sidebar />
        <Outlet />
      </div>
      <div className="flex flex-col flex-1 lg:hidden">
        <Toaster position="top-right" />
        <MobileHeader />
        <Outlet />

        <MobileNav />
      </div>
    </div>
  );
}
