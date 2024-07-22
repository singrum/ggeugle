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
  return !isMy ? (
    <div className="flex w-full gap-2">
      <div className="rounded-full w-10 h-10 border-border border text-red-500 flex items-center justify-center">
        <BotIcon />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs">끄글봇</div>
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
    <div
      className={cn(
        "border-border border rounded-xl py-1 px-2 flex max-w-[80%]",
        className
      )}
    >
      {children}
    </div>
  );
}
