import { useLocation } from "react-router";

export default function KnowledgeHeader() {
  const { pathname } = useLocation();
  const path = pathname.split("/").slice(2).map(decodeURIComponent);
  const menu = path.at(-1);
  const superMenu = path.at(-2);
  return (
    <div className="space-y-4">
      {superMenu && <h5 className="text-sm font-medium">{superMenu}</h5>}

      <h1 className="text-4xl font-semibold">{menu}</h1>
    </div>
  );
}
