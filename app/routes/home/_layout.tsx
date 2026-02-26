import { Outlet } from "react-router";
import Sidebar from "./+components/sidebar/sidebar";

export default function Index() {
  return (
    <div className=" bg-sidebar">
      <div className="h-svh flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
