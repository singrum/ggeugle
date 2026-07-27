import { Adsense } from "@ctrl/react-adsense";

export default function BannerAds() {
  return (
    <div className="w-full h-40 flex justify-center">
      <Adsense
        client="ca-pub-3218283453997693"
        slot="1024680318"
        style={{
          width: "100%",
          display: "block",
          backgroundColor: "transparent",
        }}
        format="fluid"
        responsive="true"
      />
    </div>
  );
}
