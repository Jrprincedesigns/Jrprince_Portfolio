"use client";

import { useEffect, useRef, useState } from "react";
import { doorvestSystemMapHtml } from "./embeds/doorvestSystemMap";

const EMBEDS: Record<string, string> = {
  "doorvest-system-map": doorvestSystemMapHtml,
};

/**
 * Renders a self-contained HTML embed inside a sandboxed iframe so its global
 * CSS reset and scripts can't touch the page. The embed posts its content
 * height (`cs-embed-height`); we grow the iframe to fit and never shrink, so
 * hovering nodes that reveal longer copy doesn't cause the page to jump.
 */
export default function EmbedFrame({
  embed,
  title,
  minHeight = 860,
  maxHeight = 1400,
}: {
  embed: string;
  title: string;
  minHeight?: number;
  maxHeight?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const html = EMBEDS[embed];

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (ref.current && e.source !== ref.current.contentWindow) return;
      const data = e.data;
      if (data && data.type === "cs-embed-height" && typeof data.height === "number") {
        setHeight((prev) => Math.min(maxHeight, Math.max(prev, Math.ceil(data.height))));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [maxHeight]);

  if (!html) return null;

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      loading="lazy"
      sandbox="allow-scripts"
      scrolling="no"
      style={{
        display: "block",
        width: "100%",
        maxWidth: 900,
        height,
        margin: "0 auto",
        border: 0,
        background: "transparent",
        colorScheme: "light",
      }}
    />
  );
}
