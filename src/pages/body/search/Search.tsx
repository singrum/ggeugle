import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useSheet } from "@/lib/store/useSheet";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import PreferenceSetting from "../etc/PreferenceSetting";
import CharSheet from "./CharSheet";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { SideBar } from "./SideBar";
export default function Search() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isSearchFlip = useCookieSettings((e) => e.isSearchFlip);
  const [setOpen, open] = useSheet((e) => [e.setOpen, e.open]);
  return (
    <>
      {isDesktop ? (
        <div className="flex h-full min-h-0">
          <SearchSettingsDialog />
          <ResizablePanelGroup direction="horizontal">
            {isSearchFlip ? (
              <>
                <ResizablePanel className="min-h-0">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto ">
                      <SearchInput />
                      <SearchResult />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30}>
                  <div className="h-full">
                    <SideBar />
                  </div>
                </ResizablePanel>
              </>
            ) : (
              <>
                <ResizablePanel defaultSize={30}>
                  <div className="h-full ">
                    <SideBar />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="min-h-0">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto">
                      <SearchInput />

                      <SearchResult />
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      ) : (
        <div className="flex flex-col h-full min-h-0 flex-1 relative z-10">
          <SearchSettingsDialog />
          <div className="min-h-0 h-full w-full relative">
            <div className="flex flex-col mb-10">
              <SearchInput />
              <SearchResult />
            </div>

            <div
              className={cn("fixed bottom-14 w-full flex justify-center p-3 ")}
            >
              <div
                className="bg-background text-foreground border border-border rounded-full py-2 px-4 gap-2 flex items-center justify-center shadow cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
                {/* <ChevronUp className="w-5 h-5" strokeWidth={1.5} /> */}
                <div className="mb-0.5 select-none">글자 목록</div>
              </div>
            </div>
          </div>

          <CharSheet />
        </div>
      )}
    </>
  );
}

const SearchSettingsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="search-settings-dialog-open" className="absolute hidden" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="">
          <DialogTitle>환경설정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <PreferenceSetting />
        </div>
      </DialogContent>
    </Dialog>
  );
};
