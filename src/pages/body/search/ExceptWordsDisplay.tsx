import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWC } from "@/lib/store/useWC";
import {
  Ban,
  Clipboard,
  EllipsisVertical,
  LoaderCircle,
  Replace,
  Trash2,
  X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ChangedCharsDialog } from "./ChangedCharsDialog";
export default function ExceptWordsDisplay() {
  // const [value, setValue] = useState("");

  const exceptWords = useWC((e) => e.exceptWords);
  const setExceptWords = useWC((e) => e.setExceptWords);
  const engine = useWC((e) => e.engine);
  const isLoading = useWC((e) => e.isLoading);

  return (
    <div className="border border-border rounded-xl flex flex-col">
      <div className="flex justify-between p-2 items-center">
        <div className="flex gap-1 ">
          <div className="gap-2 pl-8 relative">
            <Ban
              className="w-4 h-4 absolute top-[0.5rem] left-[0.5rem]"
              strokeWidth={1.5}
            />
            <div className="flex flex-col">
              <div>제외된 단어 목록</div>
              <div className="text-muted-foreground text-sm">
                단어 입력 후 띄어쓰기로 추가
              </div>
            </div>
          </div>
        </div>

        <ChangedCharsDialog />
        <DropdownMenu>
          <DropdownMenuTrigger className="relative focus-visible:outline-none w-6 h-8 flex items-center">
            <div className="w-6 h-8">
              <EllipsisVertical strokeWidth={1.5} className="w-6 h-6" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                exceptWords.length > 0 && engine && setExceptWords([])
              }
            >
              <Trash2 className="w-4 h-4" />
              비우기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (exceptWords.length > 0) {
                  navigator.clipboard.writeText(exceptWords.join(" "));
                }
              }}
            >
              <Clipboard className="w-4 h-4" />
              클립보드에 복사
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                document.getElementById("changed-char-dialog-open")?.click();
              }}
            >
              <Replace className="w-4 h-4" />
              변경된 글자 보기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1 items-center p-2">
        {exceptWords.length > 0 ? (
          exceptWords.map((e) => (
            <div
              className="transition-colors hover:border-foreground  rounded-full flex px-1 items-center gap-1 border border-foreground/40 cursor-pointer"
              key={e}
            >
              <div className="pl-2 text-muted-foreground">{e}</div>
              <div
                className="flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() =>
                  setExceptWords([...exceptWords.filter((ex) => ex !== e)])
                }
              >
                <X className="h-5 w-5" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">
            제외된 단어가 없습니다.
          </div>
        )}

        {engine && isLoading && (
          <LoaderCircle className="w-6 h-6 animate-spin" />
        )}
      </div>
      <Toaster
        position={"top-right"}
        toastOptions={{
          className: "bg-background border border-border text-foreground ",
        }}
      />
    </div>
  );
}
