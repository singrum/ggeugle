import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type { Chat } from "@/types/play";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import type React from "react";
import ChatLoading from "./chat-loading";
import DebugAccordion from "./debug-accordion";

export default function ChatBubble({
  chat,
  loading,
  className,
}: { loading?: boolean; chat: Chat } & React.ComponentProps<"div">) {
  const undoMove = useWcStore((e) => e.undoMove);
  const gameId = useWcStore((e) => e.selectedGame);
  return chat.type === "debug" ? (
    <DebugAccordion debug={chat.content} />
  ) : (
    <div className="flex items-center gap-0">
      {chat.isMy && chat.type === "move" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <X />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>수를 취소하시겠습니까?</DialogTitle>
              <VisuallyHidden>
                <DialogDescription />
              </VisuallyHidden>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button variant="ghost">아니요</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => undoMove(gameId!, chat.id)}
                >
                  취소
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div
        className={cn(
          "bg-muted text-foreground rounded-xl px-3 py-2",
          {
            "bg-transparent px-0": loading,
            "font-medium": chat.type === "move",
            "bg-primary text-primary-foreground": chat.isMy,
          },
          className,
        )}
      >
        {!loading ? chat.content : <ChatLoading />}
      </div>
    </div>
  );
}
