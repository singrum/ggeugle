import { useIsTablet } from "@/hooks/use-tablet";
import { Outlet } from "react-router-dom";
import KnowledgeHeader from "./header/knowledge-header";
import KnowledgeFloatingButton from "./knowledge-floating-button";

export default function KnowledgeLayout() {
  const isTablet = useIsTablet();
  return (
    <div className="prose dark:prose-invert mx-auto w-full max-w-screen-md space-y-16 p-6 pb-36 break-keep @2xl:px-12 @2xl:pt-12 @2xl:pb-36">
      <KnowledgeHeader />
      <Outlet />
      {isTablet && <KnowledgeFloatingButton />}
    </div>
  );
}
