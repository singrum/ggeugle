import { Card } from "@/components/ui/card";
import type React from "react";

export default function ExceptedWordsInputContainer({
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className="relative flex flex-col items-center gap-6 px-4 py-10 md:px-6">
      <div className="space-y-4 text-center">
        <div className="text-2xl font-bold">검색</div>
        <div className="text-muted-foreground px-4 text-sm leading-6 break-keep">
          <p>음절, 단어, 또는 기보를 검색하세요.</p>
          <p>띄어쓰기로 구분된 단어들은 전체 단어 목록에서 제외됩니다.</p>
        </div>
      </div>
      <Card className="bg-muted flex w-full flex-col justify-end gap-0 rounded-xl py-0">
        {children}
      </Card>
    </div>
  );
}
