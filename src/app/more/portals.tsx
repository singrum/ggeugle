import { Button } from "@/components/ui/button";
import { Fragment } from "react/jsx-runtime";

const portalsInfo: { title: string; href: string }[] = [
  { title: "구버전(끄글)", href: "https://singrum.github.io/ggeugle-old" },
  { title: "깃허브", href: "https://github.com/singrum/ggeugle" },
  { title: "디스코드", href: "https://discord.gg/bkHgyajx89" },
  {
    title: "피드백",
    href: "https://docs.google.com/forms/d/1h9_-byXAN2JJ1dxYpKHT2kved4yPUhHst2VhOTGXJd8/edit",
  },
];

export default function Portals() {
  return (
    <div className="space-y-2">
      <div className="text-foreground -mx-3 -my-2 flex flex-wrap items-center text-sm">
        {portalsInfo.map(({ title, href }) => (
          <Fragment key={title}>
            <div key={href} className="flex items-center">
              <Button
                variant="link"
                asChild
                className="text-muted-foreground hover:text-foreground h-auto items-start gap-0 px-3 font-normal"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
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
