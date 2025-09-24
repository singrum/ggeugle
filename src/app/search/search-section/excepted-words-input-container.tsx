import { Card } from "@/components/ui/card";
import type React from "react";

export default function ExceptedWordsInputContainer({
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className="relative flex flex-col items-center gap-6 px-4 pt-12 pb-14 md:px-6">
      <div className="space-y-4 text-center">
        <div className="text-2xl font-bold">검색</div>

        <p className="max-w-3xl px-2 text-sm leading-6 text-balance break-keep">
          음절, 단어, 또는 기보를 검색하세요. 공백으로 구분된 단어들은 전체 단어
          목록에서 제외됩니다.
        </p>
      </div>
      <Card className="bg-muted flex w-full flex-col justify-end gap-0 rounded-xl py-0">
        {children}
      </Card>
    </div>
  );
}
