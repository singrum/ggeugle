import { strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { BotIcon } from "lucide-react";
import React, { ReactNode } from "react";

export default function Chat({
  isMy,
  children,
}: {
  isMy: boolean;
  children: React.ReactNode;
}) {
  const currGame = useWC((e) => e.currGame);
  return !isMy ? (
    <div className="flex w-full gap-2">
      <div
        className={cn(
          `border border-border rounded-full w-10 h-10 flex items-center justify-center`,
          strengths[currGame!.strength].color
        )}
      >
        <BotIcon />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">끄글봇</div>
        <div className="flex">
          <ChatContent className="bg-muted text-foreground">
            {children}
          </ChatContent>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-end">
      <ChatContent className="bg-foreground text-background">
        {children}
      </ChatContent>
    </div>
  );
}

function ChatContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl py-1 px-2 flex max-w-[80%]", className)}>
      {children}
    </div>
  );
}
