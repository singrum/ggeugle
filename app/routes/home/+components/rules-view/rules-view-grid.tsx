import { AnimatePresence, motion } from "framer-motion";
import RuleViewButton from "./rule-view-button";

export function RulesViewGrid({ rules }: { rules: any[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
      <AnimatePresence>
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "tween", ease: "circOut", duration: 0.2 }}
          >
            <RuleViewButton rule={rule} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
