
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ExceptWordsDisplay from "./ExceptWordsDisplay";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import SideBar from "./SideBar";
export default function Search() {
  return (
    <>
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
    </>
  );
}
