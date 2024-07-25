import Search from "./pages/body/search/Search";
import Header from "./pages/header/Header";

import { useEffect } from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useMenu } from "./lib/store/useMenu";
import { useWC } from "./lib/store/useWC";
import NavBar from "./NavBar";
import Practice from "./pages/body/practice/Practice";
import Statistics from "./pages/body/statistics/Statistics";
import Logo from "./pages/header/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
function App() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu = useMenu((e) => e.menu);
  const updateRule = useWC((e) => e.updateRule);
  useEffect(() => {
    updateRule();
  }, []);
  return (
    <>
      <div className="relative overflow-auto h-full flex flex-col min-h-0">
        {!isDesktop && <Header />}

        <div className="flex-1 md:flex min-h-0">
          {isDesktop && (
            <div className="flex flex-col h-full items-center border-border border-r prevent-select p-2">
              <Logo />
              <NavBar />
            </div>
          )}

          <div className="flex-1 h-full min-h-0 min-w-0 w-full">
            {menu.index === 0 ? (
              <Search />
            ) : menu.index === 1 ? (
              <Practice />
            ) : (
              <Statistics />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
