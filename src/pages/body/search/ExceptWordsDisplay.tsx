import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { Clipboard, LoaderCircle, Trash2, X } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { TbStatusChange } from "react-icons/tb";
import { ChangedCharsDialog } from "./ChangedCharsDialog";

export default function ExceptWordsDisplay() {
  const [
    setValue,
    setSearchInputValue,
    exceptWords,
    setExceptWords,
    engine,
    isLoading,
    changeInfo,
  ] = useWC((e) => [
    e.setValue,
    e.setSearchInputValue,
    e.exceptWords,
    e.setExceptWords,
    e.engine,
    e.isLoading,
    e.changeInfo,
  ]);
  const [showToast] = useCookieSettings((e) => [e.showToast]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex flex-col gap-2 px-3 py-2 md:p-4 bg-background">
      <div className="flex justify-between gap-1 items-center">
        <div className="pl-1">
          <ChangedCharsDialog />
          제외된 단어
        </div>
        <div className="flex items-center gap-2">
          {[
            {
              icon: <Trash2 className="w-[1.1rem] h-[1.1rem]" />,
              onClick: () => {
                exceptWords.length > 0 && engine && setExceptWords([]);
              },
            },
            {
              icon: <Clipboard className="w-[1.1rem] h-[1.1rem]" />,
              onClick: () => {
                if (exceptWords.length > 0) {
                  navigator.clipboard.writeText(exceptWords.join(" "));
                }
              },
            },
            {
              icon: <TbStatusChange className="w-[1.1rem] h-[1.1rem]" />,
              onClick: () => {
                document.getElementById("changed-char-dialog-open")?.click();
              },
            },
          ].map(({ icon, onClick }, i) => (
            <div key={i} className="relative">
              <div
                className="cursor-pointer hover:bg-accent p-[0.375rem] rounded-md border border-border transition-colors text-muted-foreground"
                onClick={onClick}
              >
                {icon}
              </div>
              {i === 2 && Object.keys(changeInfo).length > 0 && (
                <div className="absolute w-2 h-2 rounded-full bg-primary top-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1 items-start border-border border rounded-lg p-2">
        {exceptWords.length > 0
          ? exceptWords.map((e) => (
              <div
                className="transition-colors hover:border-foreground  rounded-full flex px-1 items-center border border-foreground/40 cursor-pointer"
                key={e}
                onClick={() => {
                  const tail = e.at(engine!.rule.tailIdx)!;
                  setValue(tail);
                  setSearchInputValue(tail);
                }}
              >
                <div className="pl-2 text-muted-foreground select-none">
                  {e}
                </div>
                <div
                  className="flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    setExceptWords([...exceptWords.filter((ex) => ex !== e)]);
                  }}
                >
                  <X className="h-5 w-5" />
                </div>
              </div>
            ))
          : !(engine && isLoading) && (
              <div className="flex justify-center items-center w-full h-12">
                <div className="text-muted-foreground text-sm">
                  제외된 단어가 없습니다.
                </div>
              </div>
            )}

        {engine && isLoading && (
          <LoaderCircle className="w-6 h-6 animate-spin" />
        )}
      </div>

      <Toaster
        containerClassName={cn({ hidden: !showToast })}
        position={isDesktop ? "bottom-right" : "top-right"}
        toastOptions={{
          className: "bg-white border border-border text-black",
        }}
      />
    </div>
  );
}
