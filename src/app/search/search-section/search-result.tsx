import { searchResultMenuInfo } from "@/constants/search";
import { useWcStore } from "@/stores/wc-store";

export default function SearchResult() {
  const searchResultMenu = useWcStore((e) => e.searchResultMenu);
  const searchInputType = useWcStore((e) => e.searchInputType);
  const solver = useWcStore((e) => e.solver);
  const Component =
    searchResultMenuInfo[searchInputType][searchResultMenu].component!;
  if (solver) {
    return (
      <div className="mx-auto w-full max-w-screen-md px-4 py-8 pb-48 md:p-8 md:pb-48">
        <Component solver={solver} />
      </div>
    );
  }
}
