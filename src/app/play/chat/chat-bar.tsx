import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsTablet } from "@/hooks/use-tablet";
import { useWcStore } from "@/stores/wc-store";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Inbox } from "lucide-react";
import { useState } from "react";
export default function ChatBar({ disabled }: { disabled: boolean }) {
  const send = useWcStore((e) => e.send);
  const [message, setMessage] = useState("");
  const setOpen = useWcStore((e) => e.setPlayDrawerOpen);
  const isTablet = useIsTablet();
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      send(trimmedMessage);
      setMessage("");
    }
  };

  return (
    <div className="bg-background mx-auto w-full max-w-screen-md px-2 py-2 lg:py-4">
      <div className="relative">
        <div className="flex items-center gap-2">
          {isTablet && (
            <Button
              size="icon"
              variant="ghost"
              className="size-10"
              onClick={() => setOpen(true)}
            >
              <Inbox className="stroke-muted-foreground size-5" />
            </Button>
          )}
          <Input
            tabIndex={1}
            disabled={disabled}
            placeholder="단어를 입력해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-14 rounded-full px-6 pr-13 text-xl!"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                if (e.nativeEvent.isComposing) {
                  return;
                }
                handleSend();
              }
            }}
          />
          <Button
            disabled={disabled}
            size="icon"
            className="absolute top-1/2 right-2 size-10 -translate-y-1/2 rounded-full"
          >
            <PaperPlaneRightIcon
              className="size-5"
              weight="fill"
              onClick={handleSend}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
