import { useWcStore } from "~/stores/wc-store-provider";
import CharList from "./char-list";
import { CharSectionListLoading } from "./char-section";

export default function CharListSidebar() {
  const solver = useWcStore((e) => e.solver);

  return (
    <div className="px-6 py-8 flex-1 overflow-auto no-scrollbar min-h-0 scroll-fade-t">
      {solver ? <CharList solver={solver} /> : <CharSectionListLoading />}
    </div>
  );
}
