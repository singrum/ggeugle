import { searchResultMenuInfo } from "~/constants/search";
import { useWcStore } from "~/stores/wc-store-provider";

export default function SearchResult() {
  const searchResultMenu = useWcStore((e) => e.searchResultMenu);
  const searchInputType = useWcStore((e) => e.searchInputType);
  const solver = useWcStore((e) => e.solver);
  const Component =
    searchResultMenuInfo[searchInputType][searchResultMenu].component!;
  return solver ? (
    <div className="px-4 py-6 md:p-6 min-h-100">
      <Component solver={solver} />
    </div>
  ) : (
    <div className="h-100 px-4 py-6 md:p-6"></div>
  );
}
