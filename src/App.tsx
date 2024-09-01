import Search from "./pages/body/search/Search";

import { useEffect } from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useMenu } from "./lib/store/useMenu";
import { useWC } from "./lib/store/useWC";
import NavBar, { MenuBtn } from "./NavBar";
import Etc from "./pages/body/etc/Etc";
import Practice from "./pages/body/practice/Practice";
import Setting from "./pages/body/setting/Setting";
import Statistics from "./pages/body/statistics/Statistics";
import Logo from "./pages/header/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PreferenceSetting from "./pages/body/etc/PreferenceSetting";
import Header from "./pages/header/Header";
import { LinkIcon } from "lucide-react";
import { etcMenu, EtcNavBar } from "./EtcNavBar";

function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu = useMenu((e) => e.menu);
  const updateRule = useWC((e) => e.updateRule);
  useEffect(() => {
    updateRule();
  }, []);

  return (
    <>
      <PreferenceDialog />
      <DBDilog />
      <div className="md:flex h-full overflow-auto relative">
        {isDesktop ? (
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
            <div className="flex flex-col items-center lg:items-start md:gap-2">
              <EtcNavBar/>
            </div>
          </div>
        ) : (
          <Header />
        )}
        <div className="md:flex-1 md:h-full min-h-0 min-w-0 w-full">
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
        {!isDesktop && <NavBar />}
      </div>

      {/* <div className="overflow-auto h-full flex flex-col min-h-0 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 md:flex min-h-0 overflow-auto">
            <PreferenceDialog />
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
      </div> */}
    </>
  );
}
function PreferenceDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          id="preference-setting-dialog-trigger"
          className="absolute hidden"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>환경 설정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PreferenceSetting />
      </DialogContent>
    </Dialog>
  );
}
const DBSource = [
  {
    name: "(구)표준국어대사전",
    href: "https://github.com/korean-word-game/db",
  },
  {
    name: "(신)표준국어대사전",
    href: "https://stdict.korean.go.kr/main/main.do",
    last: "2024.01",
  },
  {
    name: "우리말샘",
    href: "https://opendict.korean.go.kr/main",
    last: "2024.04",
  },
];

function DBDilog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="db-dialog-trigger" className="absolute hidden" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>DB 출처</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start">
          {DBSource.map(({ name, href, last }) => (
            <div
              key={name}
              className="flex items-center gap-1 cursor-pointer hover:bg-accent py-1 px-2 rounded-md"
              onClick={() => open(href)}
            >
              <LinkIcon className="h-4 w-4" />
              <div>{name}</div>
              {last && <div className="text-muted-foreground">({last})</div>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default App;
