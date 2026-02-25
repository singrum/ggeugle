import GameList from "./game-list";
import SidebarHeader from "./sidebar-header";

export default function PlaySidebar() {
  return (
    <div className="space-y-4">
      <SidebarHeader />
      <GameList />
    </div>
  );
}
