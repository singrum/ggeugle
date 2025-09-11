import { UseKnowledgePath } from "@/hooks/use-knowledge-path";

export default function KnowledgeHeader() {
  const path = UseKnowledgePath();
  const menu = path.at(-1);
  const superMenu = path.at(-2);
  return (
    <div className="space-y-4">
      {superMenu && <h5 className="text-sm">{superMenu}</h5>}

      <h1 className="text-4xl font-semibold">{menu}</h1>
    </div>
  );
}
