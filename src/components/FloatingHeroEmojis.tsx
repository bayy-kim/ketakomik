"use client";

import { motion } from "framer-motion";

export function FloatingHeroEmojis() {
  return (
    <>
      <motion.div
        className="absolute top-4 left-4 sm:left-16 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] z-20"
        animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🦸‍♂️
      </motion.div>

      <motion.div
        className="absolute top-6 right-4 sm:right-16 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-[3px_3px_0_#16161A] z-20"
        animate={{ y: [0, 10, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        🦹‍♀️
      </motion.div>
    </>
  );
}
