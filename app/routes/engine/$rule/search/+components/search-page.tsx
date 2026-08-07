import { Adsense } from "@ctrl/react-adsense";
import { Toaster } from "~/components/ui/sonner";
import { useIsMobile } from "~/hooks/use-mobile";
import ExceptedWords from "./search-section/excepted-words";
import ExceptedWordsInputContainer from "./search-section/excepted-words-input-container";
import SearchInput from "./search-section/search-input";
import SearchResult from "./search-section/search-result";
import SearchResultMenu from "./search-section/search-result-menu";

export default function SearchPage() {
  const isMobile = useIsMobile();
  return (
    <div className="grid grid-cols-1 min-w-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl">
        <ExceptedWordsInputContainer>
          <ExceptedWords />
          <SearchInput />
        </ExceptedWordsInputContainer>

        <SearchResultMenu />
        <div className="px-6 pt-6">
          <div className="w-full flex justify-center">
            <Adsense
              client="ca-pub-3218283453997693"
              slot="1024680318"
              style={{
                display: "inline-block",
                ...(isMobile
                  ? { width: "100%", height: "120px" }
                  : { width: "100%", height: "120px" }),
              }}
              format="fluid"
              responsive="true"
            />
          </div>
        </div>
        <SearchResult />
        <div className="w-full flex justify-center pt-6 px-6">
          <Adsense
            client="ca-pub-3218283453997693"
            slot="9246706686"
            style={{ width: "100%" }}
            format="fluid"
            responsive="true"
          />
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
