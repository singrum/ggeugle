import type React from "react";
import { Card } from "~/components/ui/card";
import { useIsTablet } from "~/hooks/use-tablet";
import MobileCharListTrigger from "../char-list-sidebar/mobile-char-list-trigger";

export default function ExceptedWordsInputContainer({
  children,
}: React.ComponentProps<"div">) {
  const isTablet = useIsTablet();

  return (
    <div className="relative flex flex-col gap-4 lg:gap-6 px-4 py-4 pt-4 lg:pt-6 pb-14 md:px-6">
      <div className="space-y-4 pl-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold lg:text-2xl">검색</div>
          {isTablet && <MobileCharListTrigger />}
        </div>
      </div>
      <Card className="bg-muted flex w-full flex-col justify-end gap-0 rounded-xl py-0">
        {children}
      </Card>
    </div>
  );
}
