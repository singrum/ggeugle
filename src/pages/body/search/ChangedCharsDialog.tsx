import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWC } from "@/lib/store/useWC";
import { Char } from "@/lib/wc/wordChain";
import { josa } from "es-hangul";
import { TriangleAlert } from "lucide-react";

export function ChangedCharsDialog({}: {}) {
  const changeInfo = useWC((e) => e.changeInfo);
  const changedChars = Object.keys(changeInfo).sort();

  return (
    // <div></div>
    <Dialog>
      <DialogTrigger>
        <div className="absolute hidden" id="changed-char-dialog-open" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] min-h-0 overflow-auto w-[400px] scrollbar-thin">
        <DialogHeader>
          <DialogTitle>변경된 글자</DialogTitle>
          <DialogDescription className="">
            금지 단어 추가 및 삭제에 의해 유형이 변경된 글자들입니다.
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
            <div>변경된 글자가 없습니다.</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
