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
          <div className="min-h-0 h-full w-full relative">
            <div className="flex flex-col mb-10">
              <SearchInput />
              <SearchResult />
            </div>

            <div
              className={cn(
                "fixed bottom-14 w-full flex justify-center p-3 transition-opacity",
                {
                  "opacity-0 scale-95": open,
                }
              )}
            >
              <div
                className="bg-foreground text-background rounded-full py-2 px-4 gap-2 flex items-center justify-center shadow-md cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <LayoutGrid className="w-5 h-5" />
                <div>글자 목록 보기</div>
              </div>
            </div>
          </div>

          <CharSheet />
        </div>
      )}
    </>
  );
}
