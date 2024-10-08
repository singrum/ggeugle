import { strengths, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import React from "react";
import { RiRobot2Fill } from "react-icons/ri";

export default function Chat({
  isMy,
  children,
}: {
  isMy: boolean;
  children: React.ReactNode[];
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
        <RiRobot2Fill className="h-6 w-6" />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xs">끄글봇</div>
        <div className="flex flex-col items-start gap-1">
          {children.map((e, i) => (
            <ChatContent key={i} className="bg-muted text-foreground">
              {e}
            </ChatContent>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full items-end gap-1">
      {children.map((e, i) => (
        <ChatContent key={i} className="bg-primary text-background">
          {e}
        </ChatContent>
      ))}
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
        "rounded-xl py-1 px-2 flex max-w-[80%] min-w-[2rem]",
        className
      )}
    >
      {children}
    </div>
  );
}
