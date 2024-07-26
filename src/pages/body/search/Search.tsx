import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";
import ExceptWordsDisplay from "./ExceptWordsDisplay";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import SideBar from "./SideBar";
export default function Search() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <div className="flex h-full min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30}>
              <div className="h-full">
                <SideBar />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="min-h-0">
              <div className="min-h-0 h-full">
                <div className="flex flex-col p-3 gap-2 min-h-0 h-full overflow-auto scrollbar-none">
                  <ExceptWordsDisplay />
                  <SearchInput />

                  <SearchResult />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-1 relative z-10">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <div className="flex flex-col p-2 gap-2 min-h-0 h-full overflow-auto scrollbar-none mb-10">
                <ExceptWordsDisplay />
                <SearchInput />
                <SearchResult />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={6}>
              <SideBar />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </>
  );
}
