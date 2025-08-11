import DiscordIcon from "@/assets/icon/discord-icon.svg?react";
import GithubIcon from "@/assets/icon/github-icon.svg?react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type React from "react";
import { Fragment } from "react/jsx-runtime";
const iconPortalsInfo: {
  title: string;
  href: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}[] = [
  {
    title: "깃허브",
    href: "https://github.com/singrum/ggeugle",
    icon: GithubIcon,
  },
  {
    title: "디스코드",
    href: "https://discord.gg/bkHgyajx89",
    icon: DiscordIcon,
  },
];

const DBSource = [
  {
    name: "(구)표준국어대사전",
    href: "https://github.com/korean-word-game/db",
  },
  {
    name: "(신)표준국어대사전",
    href: "https://stdict.korean.go.kr/main/main.do",
  },
  {
    name: "우리말샘",
    href: "https://opendict.korean.go.kr/main",
  },
  {
    name: "네이버 국어사전",
    href: "https://ko.dict.naver.com/#/main",
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
export default function Portals() {
  return (
    <div className="space-y-2">
      <div className="text-foreground -mx-1 -my-2 flex flex-wrap items-center gap-1 text-sm">
        {iconPortalsInfo.map(({ title, href, icon: Icon }) => (
          <Fragment key={title}>
            <div key={href} className="flex items-center">
              <Button
                variant="link"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-foreground [&_svg]:stroke-foreground size-8 items-center font-normal"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex"
                >
                  <Icon className="text-foreground" />
                </a>
              </Button>
            </div>
          </Fragment>
        ))}
        <Separator orientation="vertical" className="mx-1 h-4!" />

        <div className="flex items-center gap-1">
          <FooterButton asChild>
            <a
              href={"https://ikki.app"}
              target="_blank"
              rel="noopener noreferrer"
            >
              이끼
            </a>
          </FooterButton>
          <FooterButton asChild>
            <a
              href={"https://singrum.github.io/ggeugle-old"}
              target="_blank"
              rel="noopener noreferrer"
            >
              구버전
            </a>
          </FooterButton>
          <Dialog>
            <DialogTrigger asChild>
              <FooterButton>문의</FooterButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>문의</DialogTitle>
                <VisuallyHidden>
                  <DialogDescription></DialogDescription>
                </VisuallyHidden>
              </DialogHeader>
              <div>miamiq0000@gmail.com 으로 연락해주세요.</div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <FooterButton>쿠키</FooterButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>쿠키</DialogTitle>
                <DialogDescription>쿠키에 저장하는 정보 안내</DialogDescription>
              </DialogHeader>
              <ul className="space-y-3">
                <li>음절 메뉴 유형</li>
                <li>음절 위치</li>
                <li>검색 설정</li>
                <li>동시 탐색 개수</li>
                <li>게임에서 생각하는 과정 항상 열기 여부</li>
                <li>끄투코리아 빠른 설정</li>
                <li>음절별 단어 분포 설정</li>
              </ul>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <FooterButton>DB 출처</FooterButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>DB 출처</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-start gap-0">
                {DBSource.map(({ name, href }) => (
                  <Button
                    variant="link"
                    key={name}
                    className="flex cursor-pointer items-center gap-2 px-0 text-base hover:underline"
                    onClick={() => open(href)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function FooterButton({
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  return (
    <Button
      variant="link"
      className="text-muted-foreground hover:text-foreground h-auto items-start gap-0 px-2 font-normal"
      {...props}
    />
  );
}
