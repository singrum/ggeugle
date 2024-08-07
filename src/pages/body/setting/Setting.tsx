import { cn } from "@/lib/utils";
import React, { useState } from "react";
import PreferenceSetting from "./PreferenceSetting";
import { RuleSetting } from "./RuleSetting";

const menuList = [{ name: "룰 설정" }, { name: "환경 설정" }];
export default function Setting() {
  const [menu, setMenu] = useState<number>(0);
  return (
    <div className="md:min-h-0 md:overflow-auto md:h-full">
      <div className="p-4 md:p-5 w-full md:max-w-screen-md flex flex-col gap-5">
        <div className="flex justify-start gap-1">
          {menuList.map((e, i) => (
            <React.Fragment key={i}>
              <div
                className={cn(
                  "text-muted-foreground px-4 h-7 text-sm rounded-full flex items-center transition-colors hover:text-foreground cursor-pointer",
                  {
                    " text-foreground bg-accent font-semibold": i === menu,
                  }
                )}
                onClick={() => setMenu(i)}
              >
                <div>{e.name}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {menu === 0 ? <RuleSetting /> : <PreferenceSetting />}
      </div>
    </div>
  );
}
