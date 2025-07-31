import { CharSectionListLoading } from "@/components/ui/char-section";
import { useWcStore } from "@/stores/wc-store";
import CharList from "./char-list";

export default function CharListSidebar() {
  const solver = useWcStore((e) => e.solver);

  return (
    <div className="px-6 py-8">
      {solver ? <CharList solver={solver} /> : <CharSectionListLoading />}
    </div>
  );
}
