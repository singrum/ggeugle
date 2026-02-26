import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsTablet } from "~/hooks/use-tablet";
import StorageContent from "./storage-content";
import { StorageStoreProvider, useStorageStore } from "./storage-provider";
import StorageSidebar from "./storage-sidebar";
import StorageTitle from "./storage-title";

export default function Storage({
  rules,
}: {
  rules: { id: string; title: string; color: string; updatedAt: number }[];
}) {
  const isTablet = useIsTablet();

  return (
    <StorageStoreProvider rules={rules} key={rules[0].updatedAt}>
      <StorageInner />
    </StorageStoreProvider>
  );
}

function StorageInner() {
  const isTablet = useIsTablet();
  const selectedRuleId = useStorageStore((e) => e.selectedRuleId);

  return (
    <div className="pr-2 py-2 flex-1 h-full flex gap-2">
      <Card className="rounded-lg h-full p-0 bg-background border dark:border-0 flex-1 relative">
        <ScrollArea className="h-full">
          <div className="p-0 space-y-1">
            <div className="p-6 sticky top-0 z-20 bg-background rounded-t-lg">
              <StorageTitle>보관함</StorageTitle>
            </div>
            <StorageContent />
          </div>
        </ScrollArea>
      </Card>
      {!isTablet && selectedRuleId && <StorageSidebar />}
    </div>
  );
}
