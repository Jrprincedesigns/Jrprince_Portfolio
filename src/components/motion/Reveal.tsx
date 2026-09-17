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
  /** Forwarded to the rendered element — e.g. a section's chapter-rail anchor. */
  id?: string;
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
  id,
  amount = 0.3,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  // `as` picks the rendered element; the ref stays typed to a div for simplicity.
  const MotionTag = motion[as] as typeof motion.div;

  // `data-reveal` lets a single global CSS rule force these visible under
  // prefers-reduced-motion (with !important, so it beats framer-motion's inline
  // opacity:0). Relying on framer's useReducedMotion is not enough: when reduced
  // motion is already on at load, the hook can stay false and leave below-the-
  // fold blocks stuck hidden — the CSS guard removes that failure mode entirely.
  return (
    <MotionTag
      ref={ref}
      className={className}
      id={id}
      data-reveal=""
      variants={riseIn}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
