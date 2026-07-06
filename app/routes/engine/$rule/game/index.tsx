import { useIsTablet } from "~/hooks/use-tablet";
import Play from "~/routes/engine/$rule/game/+components/play";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";
import GameList from "./+components/play-sidebar/game-list";
import SidebarHeader from "./+components/play-sidebar/sidebar-header";

export default function Game() {
  const isTablet = useIsTablet();
  return (
    <div className="flex h-full flex-1 flex-col lg:flex-row">
      {!isTablet && (
        <InnerSidebar className="flex flex-col">
          <SidebarHeader />
          <GameList />
        </InnerSidebar>
      )}
      <Play />
    </div>
  );
}
