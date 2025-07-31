import { useWcStore } from "@/stores/wc-store";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import GameButton from "./game-button";

export default function GameList() {
  const games = useWcStore((e) => e.games);
  const deleteGameState = useWcStore((e) => e.deleteGameState);

  // 삭제할 ID들 추적
  const exitingIdsRef = useRef<Set<string>>(new Set());

  return (
    <div className="space-y-4 p-4 pt-0">
      <AnimatePresence
        onExitComplete={() => {
          exitingIdsRef.current.forEach((id) => {
            deleteGameState(id);
          });
          exitingIdsRef.current.clear();
        }}
      >
        {[...games].reverse().map((id) => (
          <motion.div
            key={id}
            custom={id}
            onAnimationStart={(definition) => {
              if (
                typeof definition === "object" &&
                "opacity" in definition &&
                definition.opacity === 0
              ) {
                exitingIdsRef.current.add(id);
              }
            }}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <GameButton id={id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
