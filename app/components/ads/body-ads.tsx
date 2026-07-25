import { useEffect } from "react";
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
export default function BodyAds() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push error:", err);
    }
  }, []);
  return (
    <div className="h-200">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3218283453997693"
        data-ad-slot="1024680318"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on"
      ></ins>
    </div>
  );
}
