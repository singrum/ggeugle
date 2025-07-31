import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import type React from "react";

export default function ChatGroup({
  isMy,
  difficulty,
  children,
}: { isMy: boolean; difficulty: number } & React.ComponentProps<"div">) {
  return isMy ? (
    <div className="flex w-full flex-col items-end gap-0.5">{children}</div>
  ) : (
    <div className="flex gap-2">
      <BotImage difficulty={difficulty} />
      <div className="flex flex-1 flex-col items-start gap-0.5">{children}</div>
    </div>
  );
}

function BotImage({ difficulty }: { difficulty: number }) {
  return (
    <div className="bg-secondary flex size-10 items-center justify-center rounded-full">
      <Bot
        className={cn("m-auto size-5", {
          "text-blue-500 dark:text-blue-400": difficulty === 0,
          "text-yellow-500 dark:text-yellow-400": difficulty === 1,
          "text-red-600 dark:text-red-500": difficulty === 2,
        })}
      />
    </div>
  );
}
