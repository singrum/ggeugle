import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { useWcStore } from "@/stores/wc-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Settings } from "lucide-react";
import { useState } from "react";
import ItemsPerPageSelect from "./items-per-page-select";
import ViewSelect from "./view-select";
export default function SearchSettings() {
  const [open, setOpen] = useState(false);
  const isTablet = useIsTablet();

  if (!isTablet) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>검색 설정</TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>검색 설정</DialogTitle>
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>검색 설정</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="px-2 text-left">검색 설정</DrawerTitle>
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
  const isMobile = useIsMobile();
  return (
    <div className="mt-6 space-y-12">
      {isMobile && (
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">음절 위치</div>
          <ViewSelect />
        </div>
      )}
      <Label className="flex items-center justify-between">
        <div className="font-medium">단어 제외 시 끝 글자 자동 검색</div>
        <Switch
          checked={autoSearch}
          onCheckedChange={(e) => setAutoSearch(e)}
        />
      </Label>
      <Label className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="font-medium">검색 결과 처음에 모두 열기</div>
        </div>
        <Switch
          checked={defaultAllOpen}
          onCheckedChange={(e) => setDefaultAllOpen(e)}
        />
      </Label>
      <Label className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="font-medium">단어 제거 후 비교 알림</div>
        </div>
        <Switch
          checked={comparisonToast}
          onCheckedChange={(e) => setComparisonToast(e)}
        />
      </Label>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">페이지 당 항목 수</div>
        <ItemsPerPageSelect />
      </div>
    </div>
  );
}
