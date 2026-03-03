import { useIsTablet } from "~/hooks/use-tablet";
import Play from "~/routes/engine/$rule/game/+components/play";
import PlaySidebar from "~/routes/engine/$rule/game/+components/play-sidebar/play-sidebar";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";

export default function Game() {
  const isTablet = useIsTablet();
  return (
    <div className="flex h-full">
      {!isTablet && (
        <InnerSidebar>
          <PlaySidebar />
        </InnerSidebar>
      )}
      <Play />
    </div>
  );
}
