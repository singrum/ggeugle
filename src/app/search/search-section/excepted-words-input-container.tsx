import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsTablet } from "@/hooks/use-tablet";
import { Sidebar } from "lucide-react";
import type React from "react";
import MobileCharListTrigger from "../char-list-sidebar/mobile-char-list-trigger";

export default function ExceptedWordsInputContainer({
  children,
}: React.ComponentProps<"div">) {
  const isTablet = useIsTablet();
  const { toggleSidebar } = useSidebar();
  return (
    <div className="relative flex flex-col gap-4 px-4 py-4 pt-4 pb-14 md:px-6">
      <div className="space-y-4 pl-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold lg:text-2xl">검색</div>
          {isTablet ? (
            <MobileCharListTrigger />
          ) : (
            <Button
              variant="withHeader"
              className="size-11"
              size={"icon"}
              onClick={toggleSidebar}
            >
              <Sidebar className="stroke-foreground size-5" />
            </Button>
          )}
        </div>

        {/* <p className="max-w-3xl text-sm leading-6 break-keep">
          음절, 단어, 또는 기보를 검색하세요. 공백으로 구분된 단어들은 전체 단어
          목록에서 제외됩니다.
        </p> */}
      </div>
      <Card className="bg-muted flex w-full flex-col justify-end gap-0 rounded-xl py-0">
        {children}
      </Card>
    </div>
  );
}
