import { Adsense } from "@ctrl/react-adsense";
import { useIsMobile } from "~/hooks/use-mobile";

export default function BannerAds() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full flex justify-center">
      <Adsense
        client="ca-pub-3218283453997693"
        slot="1024680318"
        style={{
          display: "inline-block",
          ...(isMobile
            ? { width: "100%" }
            : { width: "728px", height: "90px" }),
        }}
        format="fluid"
        responsive="true"
      />
    </div>
  );
}
