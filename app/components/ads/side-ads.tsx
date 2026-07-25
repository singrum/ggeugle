import { useEffect } from "react";

export default function SideAds() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push error:", err);
    }
  }, []);
  return (
    <div className="w-80">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3218283453997693"
        data-ad-slot="2912477051"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
