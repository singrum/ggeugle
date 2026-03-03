import { Outlet } from "react-router";
import { useIsTablet } from "~/hooks/use-tablet";
import Header from "./+components/header";
import Sidebar from "./+components/sidebar";

export default function KnowledgeLayout() {
  const isTablet = useIsTablet();
  return (
    <div>
      <Header />
      <div className="flex">
        {!isTablet && <Sidebar />}

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
