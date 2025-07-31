import { motion } from "framer-motion";

export default function TestLoading() {
  return (
    <div style={{ display: "flex", gap: "8px", padding: "10px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            backgroundColor: "var(--foreground)",
            borderRadius: "50%",
            width: 12,
            height: 12,
          }}
          animate={{
            scale: [0.6, 1, 0.6],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
