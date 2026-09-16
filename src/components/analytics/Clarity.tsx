"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { isMuted } from "@/lib/clientSession";

/**
 * Microsoft Clarity — session replay, scroll and click heatmaps, and native
 * rage/dead-click detection. Free and unsampled.
 *
 * Set `NEXT_PUBLIC_CLARITY_ID` to enable. Without it nothing is injected, so
 * local dev and preview deploys stay out of the recordings.
 *
 * Honours the same `?nonotify=1` mute as the Slack layer: the tag is injected
 * from an effect rather than server-rendered, so a muted browser never loads
 * Clarity at all — no session, no replay, no heatmap contribution. Mute is the
 * one switch for both layers, which is what "mute this browser" has to mean.
 */
export default function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isMuted(new URLSearchParams(window.location.search))) setAllowed(true);
  }, []);

  if (!id || !allowed) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
