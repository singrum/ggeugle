import type { MoveRow } from "@/types/search";
import WordRow from "./word-row";

export default function WordsTable({ rows }: { rows: MoveRow[] }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-0.5">
        {rows.map((row, i) => (
          <WordRow data={row} key={i} />
        ))}
      </div>
    </div>
  );
}
