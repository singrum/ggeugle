import { Char } from "@/lib/wc/wordChain";
import { josa } from "es-hangul";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWC } from "@/lib/store/useWC";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircleX, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ChangedCharsAlert({
  changeInfo,
}: {
  changeInfo: Record<Char, { prevType: string; currType: string }>;
}) {
  const changedChars = Object.keys(changeInfo);
  return (
    <div
      className="flex flex-col text-muted-foreground cursor-pointer gap-1 "
      onClick={() =>
        document.getElementById("changed-char-dialog-open")?.click()
      }
    >
      {changedChars.slice(0, 3).map((char) => (
        <div key={char}>
          <span className="text-foreground">{char}</span>
          {josa(char, "이/가").at(-1)}{" "}
          <span className={`text-${changeInfo[char].prevType}`}>
            {changeInfo[char].prevType === "route"
              ? "루트"
              : changeInfo[char].prevType === "win"
              ? "승리"
              : "패배"}
          </span>
          에서{" "}
          {changeInfo[char].currType !== "deleted" ? (
            <>
              <span className={`text-${changeInfo[char].currType}`}>
                {changeInfo[char].currType === "route"
                  ? "루트"
                  : changeInfo[char].currType === "win"
                  ? "승리"
                  : "패배"}
              </span>
              {"로 변경"}
            </>
          ) : (
            "삭제됨"
          )}
        </div>
      ))}
      {changedChars.length > 3 && (
        <div className="hover:underline hover:text-foreground">
          외 {changedChars.length - 3}개 더보기
        </div>
      )}
      {/* <ChangedCharsAlert changeInfo={changeInfo} /> */}
    </div>
  );
}
export function ChangedCharsDialog({}: {}) {
  const changeInfo = useWC((e) => e.changeInfo);
  const changedChars = Object.keys(changeInfo).sort();

  return (
    <Dialog>
      <DialogTrigger>
        <button className="absolute hidden" id="changed-char-dialog-open" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] min-h-0 overflow-auto w-[400px] scrollbar-thin">
        <DialogHeader>
          <DialogTitle>변경된 글자</DialogTitle>
          <DialogDescription className="">
            최근의 단어 추가/삭제에 의해 종류(승리, 패배, 루트)가 변경된 글자들
          </DialogDescription>
        </DialogHeader>

        {changedChars.length > 0 ? (
          <div className="flex flex-col border border-border rounded-md p-2 w-full items-center gap-2 text-muted-foreground">
            {changedChars.map((char) => (
              <div key={char}>
                <span className="text-foreground">{char}</span>
                {josa(char, "이/가").at(-1)}{" "}
                <span className={`text-${changeInfo[char].prevType}`}>
                  {changeInfo[char].prevType === "route"
                    ? "루트"
                    : changeInfo[char].prevType === "win"
                    ? "승리"
                    : "패배"}
                </span>
                에서{" "}
                {changeInfo[char].currType !== "deleted" ? (
                  <>
                    <span className={`text-${changeInfo[char].currType}`}>
                      {changeInfo[char].currType === "route"
                        ? "루트"
                        : changeInfo[char].currType === "win"
                        ? "승리"
                        : "패배"}
                    </span>
                    {"로 변경"}
                  </>
                ) : (
                  "삭제됨"
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col border border-border rounded-md p-2 w-full items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>변경된 글자가 없습니다.</AlertTitle>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
