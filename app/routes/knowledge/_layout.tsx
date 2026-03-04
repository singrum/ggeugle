import { useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./+components/header";
import Sidebar from "./+components/sidebar";

export default function KnowledgeLayout() {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(
      document.body,
    ).backgroundColor;
    document.body.style.backgroundColor = "var(--background)";

    return () => {
      document.body.style.backgroundColor = originalStyle;
    };
  }, []);
  return (
    <div className="bg-background">
      <Header />
      <div className="flex bg-background">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
