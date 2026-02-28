import { useIsMobile } from "~/hooks/use-mobile";
import Play from "~/routes/engine/$rule/game/+components/play";
import PlaySidebar from "~/routes/engine/$rule/game/+components/play-sidebar/play-sidebar";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";

export default function Game() {
  const isMobile = useIsMobile();
  return (
    <div className="flex h-full">
      {!isMobile && (
        <InnerSidebar>
          <PlaySidebar />
        </InnerSidebar>
      )}
      <Play />
    </div>
  );
}
