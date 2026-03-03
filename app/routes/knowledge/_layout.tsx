import { Outlet } from "react-router";
import Header from "./+components/header";
import Sidebar from "./+components/sidebar";

export default function KnowledgeLayout() {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
