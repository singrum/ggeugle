import { range } from "lodash-es";
import { Skeleton } from "~/components/ui/skeleton";

export default function RulesViewGridLoading() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
      {range(20).map((i) => (
        <Skeleton className="h-13 w-full" key={i} />
      ))}
    </div>
  );
}
