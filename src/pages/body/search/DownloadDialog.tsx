import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useWC } from "@/lib/store/useWC";
import { getCurrentDateTime } from "@/lib/utils";
import { WCDisplay, WCEngine } from "@/lib/wc/WordChain";
import { Download } from "lucide-react";
import React from "react";

const downloadOptions = [
  {
    name: "모든 단어",
    description: "사전에 있는 모든 단어 목록",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `[끄글]모든단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([engine!.words.sort().join("\n")], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "루트 단어 사전",
    description: "루트 글자에 대한 루트 단어, 되돌림 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `[끄글]루트단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadRouteWords(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "승리 단어 사전",
    description: "승리 글자에 대한 승리 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `[끄글]승리단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadWinWords(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "필수 승리 단어 사전",
    description: "승리 글자에 대한 한 개의 승리 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `[끄글]필수승리단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadWinWordsEssential(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "패배 단어 사전",
    description: "패배 글자에 대한 패배 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `[끄글]패배단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadLosWords(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
];

export default function DownloadDialog() {
  const [engine] = useWC((e) => [e.engine]);
  return (
    <Dialog>
      <DialogTrigger>
        <Badge
          variant={"secondary"}
          className="gap-1 cursor-pointer select-none rounded-md"
        >
          단어 파일 다운로드 <Download className="h-3 w-3" />
        </Badge>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>단어 파일 다운로드</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {downloadOptions.map(({ name, description, action }, i) => (
            <React.Fragment key={name}>
              <div className="flex w-full gap-2 items-center px-2">
                <div className="flex-1">
                  <div className="font-semibold">{name}</div>
                  {/* <div className="text-sm text-muted-foreground">
                    {description}
                  </div> */}
                </div>

                <div className="flex justify-end">
                  <Button size="sm" onClick={() => engine && action(engine)}>
                    다운로드
                  </Button>
                </div>
              </div>
              {i !== downloadOptions.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
