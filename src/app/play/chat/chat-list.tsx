import { cn, groupByConsecutiveCallback } from "@/lib/utils";
import type { Chat } from "@/types/play";
import { AnimatePresence, motion } from "framer-motion";
import ChatBubble from "./chat-bubble";
import ChatGroup from "./chat-group";

export default function ChatList({
  chats,
  difficulty,

  loading,
}: {
  chats: Chat[];
  difficulty: number;

  loading: boolean;
}) {
  const chatGroups = groupByConsecutiveCallback(chats, (e: Chat) => {
    return e.type === "debug" || e.isMy === false;
  });

  return (
    <div className="space-y-4 px-4 pt-8 pb-2 md:px-8 md:py-4 md:pt-16">
      <AnimatePresence>
        {chatGroups.map((group, i) => (
          <motion.div
            className={cn({
              "flex justify-end": group[0].type !== "debug" && group[0].isMy,
            })}
            key={group[0].id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatGroup
              isMy={group[0].type !== "debug" && group[0].isMy}
              difficulty={difficulty}
            >
              <AnimatePresence>
                {group.map((chat) => (
                  <motion.div
                    className="max-w-4/5"
                    key={chat.id}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble
                      key={chat.id}
                      chat={chat}
                      className={cn("rounded-xl")}
                    />
                  </motion.div>
                ))}
                {chatGroups.length - 1 === i && loading && (
                  <ChatBubble
                    chat={{
                      id: "asdf",
                      type: "chat",
                      content: "asdf",
                      isMy: false,
                    }}
                    loading
                  />
                )}
              </AnimatePresence>
            </ChatGroup>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
