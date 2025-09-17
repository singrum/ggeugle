import MobileBottomBar from "@/components/mobile-nav-bar/mobile-bottom-bar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMount } from "@/hooks/use-mount";
import { useIsTablet } from "@/hooks/use-tablet";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { Outlet } from "react-router-dom";
export const iframeHeight = "800px";

export default function Layout() {
  const isMount = useMount();
  const isTablet = useIsTablet();

  if (isMount)
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Analytics />
        <SidebarProvider
          defaultOpen={true}
          style={
            {
              "--sidebar-width": "max(400px,min(33svw, 600px))",
            } as React.CSSProperties
          }
        >
          {/* <DonationToast /> */}

          {!isTablet && <AppSidebar />}

          <SidebarInset className="@container/main flex max-w-full min-w-0 flex-col">
            <Outlet />
            {isTablet && <MobileBottomBar />}
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    );
}
