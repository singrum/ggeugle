import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Code, Database, History, LinkIcon, Settings } from "lucide-react";

import DarkLogo from "/logo/dark.png";
import LightLogo from "/logo/light.png";
import { useTheme } from "@/components/theme-provider";

import React from "react";
const etcMenu = [
  {
    name: "환경 설정",
    icon: <Settings />,
    onClick_: () => {
      document.getElementById("preference-setting-dialog-trigger")?.click();
    },
  },

  {
    name: "이전 버전",
    icon: <History />,
    onClick_: () => {
      open("https://singrum.github.io/ggeugle-old");
    },
  },
  {
    name: "깃허브",
    icon: <Code />,
    onClick_: () => {
      open("https://github.com/singrum/ggeugle");
    },
  },
  {
    name: "DB 출처",
    icon: <Database />,
    onClick_: () => {
      document.getElementById("db-dialog-trigger")?.click();
    },
  },
];
export default function Etc() {
  const ref = React.useRef(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex md:p-10 text-xl h-full w-full items-center justify-center select-none flex-1">
          <div className="flex flex-col md:gap-20 lg:gap-[10rem] md:flex-row items-center justify-center border-border md:border rounded-xl w-full h-full">
            {isDesktop &&
              (currTheme === "dark" ? (
                <img
                  src={DarkLogo}
                  alt="logo"
                  className="max-h-[100px] md:max-h-[200px]"
                />
              ) : (
                <img
                  src={LightLogo}
                  alt="logo"
                  className="max-h-[100px] md:max-h-[200px]"
                />
              ))}

            <div className="flex flex-col gap-5 md:w-[200px]">
              {etcMenu.map(({ name, icon, onClick_ }) => (
                <div
                  key={name}
                  className="flex gap-2 items-center cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={onClick_}
                >
                  {icon}
                  <div>{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DBDilog />
    </>
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
