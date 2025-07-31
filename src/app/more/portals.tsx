import DiscordIcon from "@/assets/icon/discord-icon.svg?react";
import GithubIcon from "@/assets/icon/github-icon.svg?react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
const portalsInfo: { title: string; href: string }[] = [
  {
    title: "피드백",
    href: "https://docs.google.com/forms/d/1h9_-byXAN2JJ1dxYpKHT2kved4yPUhHst2VhOTGXJd8/edit",
  },
  { title: "구버전(끄글)", href: "https://singrum.github.io/ggeugle-old" },
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
                className="text-muted-foreground hover:text-foreground size-8 items-center font-normal"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex"
                >
                  <Icon className="stroke-foreground" />
                </a>
              </Button>
            </div>
          </Fragment>
        ))}
        <Separator orientation="vertical" className="mx-2 h-5!" />
        {portalsInfo.map(({ title, href }) => (
          <Fragment key={title}>
            <div key={href} className="flex items-center">
              <Button
                variant="link"
                asChild
                className="text-muted-foreground hover:text-foreground h-auto items-start gap-0 px-2 font-normal"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {title}
                  {/* <MoveUpRight className="mt-1 size-3 stroke-1" /> */}
                </a>
              </Button>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
