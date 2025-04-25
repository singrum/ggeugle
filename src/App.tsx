import Search from "./pages/body/search/Search";

import { useEffect, useState } from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useMenu } from "./lib/store/useMenu";
import { useWC } from "./lib/store/useWC";
import NavBar from "./NavBar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquareArrowOutUpRight, X } from "lucide-react";
import LogoButton from "./components/LogoButton";
import { Separator } from "./components/ui/separator";
import { EtcNavBar } from "./EtcNavBar";
import PreferenceSetting from "./pages/body/etc/PreferenceSetting";
import Practice from "./pages/body/practice/Practice";
import { ChangedCharsDialog } from "./pages/body/search/ChangedCharsDialog";
import Setting from "./pages/body/setting/Setting";
import Statistics from "./pages/body/statistics/Statistics";
import Header from "./pages/header/Header";
import Logo from "./pages/header/Logo";

function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu = useMenu((e) => e.menu);
  const updateRule = useWC((e) => e.updateRule);
  const [showAlert, setShowAlert] = useState(false);
  const [setValue, setSearchInputValue] = useWC((e) => [
    e.setValue,
    e.setSearchInputValue,
  ]);

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      setValue(event.state || "");
      setSearchInputValue(event.state || "", true);
    });

    updateRule();
  }, []);

  return (
    <>
      <ChangedCharsDialog />
      <PreferenceDialog />
      <DBDilog />
      <div className="md:flex md:flex-col md:h-full md:min-h-0 h-full">
        {isDesktop && showAlert && (
          <div
            className="text-xs flex justify-between text-[hsl(355.7,100%,97.3%)] bg-[hsl(142.1,76.2%,36.3%)] cursor-pointer font-semibold items-center"
            onClick={() => {
              setShowAlert(false);
            }}
          >
            <div className="p-1 invisible">
              <X className="w-4 h-4" />
            </div>
            <div
              className="flex  gap-1 items-center p-1"
              onClick={(e) => {
                e.stopPropagation();
                open("https://ikki.app");
              }}
            >
              <SquareArrowOutUpRight className="h-3 w-3" strokeWidth="2.5" />
              끝말잇기 하러 가기
            </div>
            <div className="p-1">
              <X className="w-4 h-4" />
            </div>
          </div>
        )}

        <div className="md:flex h-full overflow-auto relative">
          {isDesktop ? (
            <div className="flex flex-col h-full items-center lg:items-start justify-between border-border border-r prevent-select p-2 lg:p-2 lg:px-3 lg:pt-3 overflow-auto scrollbar-none min-h-0 lg:w-[160px]">
              <div className="flex flex-col w-full items-center lg:items-start md:gap-4">
                <LogoButton />
                

                <NavBar />
              </div>
              <div className="w-full">
                <Separator />
                <div className="flex flex-col items-center lg:items-start md:gap-2 pt-2 px-2 pb-1 w-full">
                  <EtcNavBar />
                </div>
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
            ) : (
              <Setting />
            )}
          </div>
          {!isDesktop && <NavBar />}
        </div>
      </div>
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
    last: "2024.11",
  },
  {
    name: "네이버 국어사전",
    href: "https://ko.dict.naver.com/#/main",
    last: "2024.09",
  },
  {
    name: "KKuTu Github",
    href: "https://github.com/JJoriping/KKuTu",
  },
  {
    name: "끄투코리아",
    href: "https://kkutu.co.kr/",
  },
  {
    name: "끄투코리아 단어사전 v6",
    href: "https://kkutudic.pythonanywhere.com/",
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
        <div className="flex flex-col items-start gap-2">
          {DBSource.map(({ name, href, last }) => (
            <div
              key={name}
              className="flex items-center gap-2 cursor-pointer hover:underline "
              onClick={() => open(href)}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
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
