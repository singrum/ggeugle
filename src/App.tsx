import Search from "./pages/body/search/Search";

import { useEffect } from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useMenu } from "./lib/store/useMenu";
import { useWC } from "./lib/store/useWC";
import NavBar from "./NavBar";
import Etc from "./pages/body/etc/Etc";
import Practice from "./pages/body/practice/Practice";
import Setting from "./pages/body/setting/Setting";
import Statistics from "./pages/body/statistics/Statistics";
import Logo from "./pages/header/Logo";

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
              <div className="flex flex-col h-full items-center lg:items-start justify-between border-border border-r prevent-select p-2 lg:p-2 overflow-auto scrollbar-none min-h-0">
                <div className="flex flex-col items-center lg:items-start md:gap-2">
                  <div
                    className="md:p-1 lg:px-4 lg:pt-3"
                    onClick={() => {
                      location.reload();
                    }}
                  >
                    <Logo />
                    <div className="hidden lg:block text-muted-foreground mb-1 text-xs">
                      끝말잇기 검색엔진
                    </div>
                  </div>

                  <NavBar />
                </div>
              </div>
            )}

            <div className="flex-1 h-full min-h-0 min-w-0 w-full">
              {menu === 0 ? (
                <Search />
              ) : menu === 1 ? (
                <Statistics />
              ) : menu === 2 ? (
                <Practice />
              ) : menu === 3 ? (
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

export default App;
