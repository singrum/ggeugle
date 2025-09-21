import MobileBottomBar from "@/components/mobile-nav-bar/mobile-bottom-bar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SiteHeader from "@/components/site-header/site-header";
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
        <div className="[--header-height:calc(--spacing(14))]">
          <SidebarProvider
            className="flex flex-col"
            defaultOpen={true}
            style={
              {
                "--sidebar-width": "max(400px,min(33svw, 600px))",
              } as React.CSSProperties
            }
          >
            <SiteHeader />
            {/* <DonationToast /> */}
            <div className="bg-sidebar flex flex-1 pr-2 pb-2">
              {!isTablet && <AppSidebar />}

              <SidebarInset className="bg-background @container/main flex h-[calc(100svh-var(--header-height)-(--spacing(2)))] min-h-0 flex-col overflow-auto">
                <Outlet />
                {isTablet && <MobileBottomBar />}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    );
}
