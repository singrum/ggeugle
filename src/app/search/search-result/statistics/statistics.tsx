import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import MaxRouteCharDataTable from "./max-route-char-data-table";
import NodeTypeNumChart from "./node-type-num-chart";
import WinloseDetailChart from "./winlose-detail-chart";
import WordTypeNumChart from "./word-type-num-chart";

export default function Statistics({ solver }: { solver: WordSolver }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <div className="col-span-2 md:col-span-1">
        <WordTypeNumChart solver={solver} />
      </div>
      <div className="col-span-2 md:col-span-1">
        <NodeTypeNumChart solver={solver} />
      </div>

      <div className="col-span-2">
        <MaxRouteCharDataTable solver={solver} />
      </div>

      <div className="col-span-2">
        <WinloseDetailChart solver={solver} />
      </div>
    </div>
  );
}
