import Header from "./pages/header/Header";
import Search from "./pages/body/search/Search";

import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
import { useEffect } from "react";
import { useWC } from "./lib/store/useWC";

function App() {
  const menu = useMenu((e) => e.menu);
  const setMenu = useMenu((e) => e.setMenu);
  const initWorker = useWC((e) => e.initWorker);
  useEffect(() => {
    initWorker();
  }, []);
  return (
    <>
      <div className="h-full flex flex-col min-h-0">
        <Header />
        <div className="flex-1 flex min-h-0">
          <div className="flex flex-col h-full items-center gap-2 py-2 px-2 border-border border-r prevent-select">
            {menus.map((e, i) => (
              <div
                key={i}
                className={cn(
                  "h-12 w-12 flex flex-col items-center cursor-pointer hover:bg-accent rounded-lg p-1 transition-colors",
                  { "bg-accent": menu.index === e.index }
                )}
                onClick={() => setMenu(e.index)}
              >
                {e.icon}
                <div className="text-xs">{e.name}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 h-full min-h-0">
            <Search />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
