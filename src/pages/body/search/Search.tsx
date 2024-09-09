import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import CharSheet from "./CharSheet";

import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { SideBar } from "./SideBar";
export default function Search() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isSearchFlip = useCookieSettings((e) => e.isSearchFlip);

  return (
    <>
      {isDesktop ? (
        <div className="flex h-full min-h-0">
          <ResizablePanelGroup direction="horizontal">
            {isSearchFlip ? (
              <>
                <ResizablePanel className="min-h-0 pr-4">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto ">
                      <SearchInput />
                      <SearchResult />
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30}>
                  <div className="h-full p-4 pl-0">
                    <SideBar />
                  </div>
                </ResizablePanel>
              </>
            ) : (
              <>
                <ResizablePanel defaultSize={30}>
                  <div className="h-full p-4 pr-0">
                    <SideBar />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="min-h-0 ">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto ">
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
          <div className="min-h-0 h-full w-full ">
            <div className="flex flex-col mb-10">
              <SearchInput />
              <SearchResult />
            </div>
          </div>
          <CharSheet />
        </div>
      )}
    </>
  );
}
