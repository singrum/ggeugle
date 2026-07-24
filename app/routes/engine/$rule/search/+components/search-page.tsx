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
        <ExceptedWordsInputContainer>
          <ExceptedWords />
          <SearchInput />
        </ExceptedWordsInputContainer>
        <SearchResultMenu />
        {/* <BodyAds /> */}
        <SearchResult />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
