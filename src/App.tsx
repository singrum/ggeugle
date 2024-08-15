import Search from "./pages/body/search/Search";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis, History, Menu } from "lucide-react";
import { useEffect } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { useMediaQuery } from "./hooks/use-media-query";
import { useMenu } from "./lib/store/useMenu";
import { useWC } from "./lib/store/useWC";
import NavBar, { MenuBtn } from "./NavBar";
import Practice from "./pages/body/practice/Practice";
import Setting from "./pages/body/setting/Setting";
import Statistics from "./pages/body/statistics/Statistics";
import Logo from "./pages/header/Logo";
import Header from "./pages/header/Header";
import Etc from "./pages/body/etc/Etc";

function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu = useMenu((e) => e.menu);
  const updateRule = useWC((e) => e.updateRule);
  useEffect(() => {
    updateRule();
  }, []);
  return (
    <>
      <div className="relative overflow-auto h-full flex flex-col min-h-0 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 md:flex min-h-0 overflow-auto">
            {isDesktop && (
              <div className="flex flex-col h-full items-center lg:items-start justify-between border-border border-r prevent-select p-2 overflow-auto scrollbar-none min-h-0">
                <div className="flex flex-col items-center lg:items-start">
                  <div className=" mb-1">
                    <Logo />
                    <div className="hidden lg:block text-muted-foreground mb-1 text-xs">
                      끝말잇기 검색기
                    </div>
                  </div>

                  <NavBar />
                </div>
              </div>
            )}

            <div className="flex-1 h-full min-h-0 min-w-0 w-full">
              {menu.index === 0 ? (
                <Search />
              ) : menu.index === 1 ? (
                <Practice />
              ) : menu.index === 2 ? (
                <Statistics />
              ) : menu.index === 3 ? (
                <Setting />
              ) : (
                <Etc />
              )}
            </div>
          </div>
        </div>
        {!isDesktop && <NavBar />}
      </div>
    </>
  );
}
// export function EtcDropdown() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="focus-visible:outline-none">
//         <div>
//           <div className="lg:static lg:block hidden absolute">
//             <MenuBtn
//               icon={<CircleEllipsis strokeWidth={1.5} />}
//               name={"더보기"}
//             />
//           </div>

//           <div className="hidden absolute md:static md:block lg:hidden lg:absolute md:p-2">
//             <CircleEllipsis strokeWidth={1.5} />
//           </div>
//           <div className="block md:hidden md:absolute md:p-2">
//             <Menu strokeWidth={1.5} />
//           </div>
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuItem
//           onClick={() => open("https://singrum.github.io/ggeugle_old")}
//         >
//           <History className="h-4 w-4" />
//           이전 버전
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => open("https://github.com/singrum/ggeugle")}
//         >
//           <VscGithubInverted size={15} />
//           깃허브
//         </DropdownMenuItem>
//         {/* <DropdownMenuSeparator /> */}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

export default App;
