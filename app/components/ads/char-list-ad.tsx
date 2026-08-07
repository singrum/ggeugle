import { Adsense } from "@ctrl/react-adsense";
import { useIsMobile } from "~/hooks/use-mobile";

export default function CharListAd() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full flex justify-center">
      <Adsense
        client="ca-pub-3218283453997693"
        slot="1024680318"
        style={{
          display: "inline-block",
          ...{ width: "100%" },
        }}
        format="fluid"
        responsive="true"
      />
    </div>
  );
}
