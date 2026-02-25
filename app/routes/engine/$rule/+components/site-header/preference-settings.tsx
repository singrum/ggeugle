import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { useIsMobile } from "~/hooks/use-mobile";
import { useIsTablet } from "~/hooks/use-tablet";
import { useWcStore } from "~/stores/wc-store";

import ItemsPerPageSelect from "./items-per-page-select";
import WordDispSelect from "./word-disp-select";
export default function PreferenceSettingsTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  const [open, setOpen] = useState(false);
  const isTablet = useIsTablet();

  if (!isTablet) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger {...props} />

        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>환경 설정</DialogTitle>
            <VisuallyHidden>
              <DialogDescription></DialogDescription>
            </VisuallyHidden>
          </DialogHeader>

          <SearchSettingsForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger {...props} />

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="px-2 text-left">환경 설정</DrawerTitle>
          <VisuallyHidden>
            <DrawerDescription></DrawerDescription>
          </VisuallyHidden>
        </DrawerHeader>

        <div className="overflow-auto px-6 pb-6">
          <SearchSettingsForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SearchSettingsForm() {
  const autoSearch = useWcStore((e) => e.autoSearch);
  const setAutoSearch = useWcStore((e) => e.setAutoSearch);
  const defaultAllOpen = useWcStore((e) => e.defaultAllOpen);
  const setDefaultAllOpen = useWcStore((e) => e.setDefaultAllOpen);
  const comparisonToast = useWcStore((e) => e.comparisonToast);
  const setComparisonToast = useWcStore((e) => e.setComparisonToast);
  const debugOpen = useWcStore((e) => e.debugOpen);
  const setDebugOpen = useWcStore((e) => e.setDebugOpen);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 pt-2">
      <div className="text-muted-foreground text-sm font-medium">검색</div>
      <div className="space-y-4">
        <Label className="flex items-center justify-between">
          <div className="font-medium">단어 제외 시 끝 글자 자동 검색</div>
          <div className="flex h-9 items-center">
            <Switch
              checked={autoSearch}
              onCheckedChange={(e) => setAutoSearch(e)}
            />
          </div>
        </Label>
        <Label className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">검색 결과 처음에 모두 열기</div>
          </div>
          <div className="flex h-9 items-center">
            <Switch
              checked={defaultAllOpen}
              onCheckedChange={(e) => setDefaultAllOpen(e)}
            />
          </div>
        </Label>
        <Label className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">단어 제거 후 비교 알림</div>
          </div>

          <div className="flex h-9 items-center">
            <Switch
              checked={comparisonToast}
              onCheckedChange={(e) => setComparisonToast(e)}
            />
          </div>
        </Label>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">단어 보기</div>
          <WordDispSelect />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">페이지 당 항목 수</div>
          <ItemsPerPageSelect />
        </div>
      </div>
      <Separator />
      <div className="text-muted-foreground text-sm font-medium">게임</div>
      <div className="space-y-4">
        <Label className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">생각하는 과정 표시</div>
          </div>

          <div className="flex h-9 items-center">
            <Switch
              checked={debugOpen}
              onCheckedChange={(e) => setDebugOpen(e as boolean)}
            />
          </div>
        </Label>
      </div>
    </div>
  );
}
