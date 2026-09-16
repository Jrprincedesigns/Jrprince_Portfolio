import Script from "next/script";

/**
 * Microsoft Clarity — session replay, scroll and click heatmaps, and native
 * rage/dead-click detection. Free and unsampled.
 *
 * Set `NEXT_PUBLIC_CLARITY_ID` to enable. Without it nothing is injected, so
 * local dev and preview deploys stay out of the recordings.
 */
export default function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
