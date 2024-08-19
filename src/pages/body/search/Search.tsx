import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMenu } from "@/lib/store/useMenu";
import Header from "@/pages/header/Header";
import CharSheet from "./CharSheet";
import ExceptWordsDisplay from "./ExceptWordsDisplay";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { SideBar } from "./SideBar";
import { useWC } from "@/lib/store/useWC";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
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
                <ResizablePanel className="min-h-0 bg-muted/40">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto ">
                      <ExceptWordsDisplay />
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
                  <div className="h-full">
                    <SideBar />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="min-h-0 bg-muted/40">
                  <div className="min-h-0 h-full">
                    <div className="flex flex-col min-h-0 h-full overflow-auto ">
                      <ExceptWordsDisplay />
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
          <div className="overflow-auto min-h-0 h-full w-full bg-muted/40">
            <Header />
            <div className="flex flex-col mb-10">
              <ExceptWordsDisplay />
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
