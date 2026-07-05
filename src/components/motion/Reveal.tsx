"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { riseIn } from "./motion";

interface RevealProps {
  children: React.ReactNode;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  /** Render as a different element while keeping the animation. */
  as?: "div" | "section" | "li" | "span";
  className?: string;
  /** How far the element must scroll into view before animating (0–1). */
  amount?: number;
  /** Animate only once (default) or every time it enters the viewport. */
  once?: boolean;
}

/**
 * Scroll-triggered reveal. Wrap any block to have it fade + rise into view.
 * Respects prefers-reduced-motion automatically (globals.css neutralizes
 * transitions), and only animates when scrolled into view for performance.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  amount = 0.3,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  // `as` picks the rendered element; the ref stays typed to a div for simplicity.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={riseIn}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
