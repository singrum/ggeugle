import MobileBottomBar from "@/components/mobile-nav-bar/mobile-bottom-bar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SiteHeader from "@/components/site-header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMount } from "@/hooks/use-mount";
import { useIsTablet } from "@/hooks/use-tablet";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { Outlet } from "react-router-dom";

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
            <div className="flex flex-1">
              {!isTablet && <AppSidebar />}

              <SidebarInset className="bg-background @container/main flex flex-col">
                <Outlet />
                {isTablet && <MobileBottomBar />}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    );
}

// export const iframeHeight = "800px";

// export default function Layout() {
//   const isMount = useMount();
//   const isTablet = useIsTablet();

//   if (isMount)
//     return (
//       <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
//         <Analytics />
//         <SidebarProvider
//           defaultOpen={true}
//           style={
//             {
//               "--header-height": "calc(--spacing(14))",
//               "--sidebar-width": "max(400px,min(33svw, 600px))",
//             } as React.CSSProperties
//           }
//         >
//           {/* <DonationToast /> */}

//           {!isTablet && <AppSidebar />}

//           <SidebarInset className="bg-background @container/main mt-[var(--header-height)] flex h-[calc(100svh-var(--header-height))] max-w-full min-w-0 flex-col overflow-auto">
//             <Outlet />
//             {isTablet && <MobileBottomBar />}
//           </SidebarInset>
//         </SidebarProvider>
//       </ThemeProvider>
//     );
// }
