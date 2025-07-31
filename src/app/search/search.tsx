import { Toaster } from "@/components/ui/sonner";
import SearchFloatingButtons from "./search-floating-buttons/search-floating-buttons";
import SearchHeader from "./search-header/search-header";
import ExceptedWords from "./search-section/excepted-words";
import ExceptedWordsInputContainer from "./search-section/excepted-words-input-container";
import SearchInput from "./search-section/search-input";
import SearchResult from "./search-section/search-result";
import SearchResultMenu from "./search-section/search-result-menu";

export default function Search() {
  return (
    <div className="relative flex h-full w-full min-w-0 flex-1 flex-col">
      <SearchHeader />
      <ExceptedWordsInputContainer>
        <ExceptedWords />
        <SearchInput />
      </ExceptedWordsInputContainer>
      <SearchResultMenu />
      <SearchResult />
      <SearchFloatingButtons />

      <Toaster position="top-right" />
    </div>
  );
}
