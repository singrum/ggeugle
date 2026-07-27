import { Adsense } from "@ctrl/react-adsense";
import BannerAds from "~/components/ads/banner-ads";
import { Toaster } from "~/components/ui/sonner";
import ExceptedWords from "./search-section/excepted-words";
import ExceptedWordsInputContainer from "./search-section/excepted-words-input-container";
import SearchInput from "./search-section/search-input";
import SearchResult from "./search-section/search-result";
import SearchResultMenu from "./search-section/search-result-menu";

export default function SearchPage() {
  return (
    <div className="grid grid-cols-1 min-w-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl">
        <div className="lg:px-6 ">
          <BannerAds />
        </div>
        <ExceptedWordsInputContainer>
          <ExceptedWords />
          <SearchInput />
        </ExceptedWordsInputContainer>

        <SearchResultMenu />

        <SearchResult />
        <div className="w-full flex justify-center pt-6 lg:px-6">
          <Adsense
            client="ca-pub-3218283453997693"
            slot="1024680318"
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
