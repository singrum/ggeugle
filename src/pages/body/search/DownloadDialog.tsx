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
    name: "모든 단어 목록",
    description: "사전에 있는 모든 단어 목록",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_모든단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([engine!.words.sort().join("\n")], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "모든 음절 목록",
    description: "음절 유형(승리, 패배, 루트)에 따른 분류",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_모든음절_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadCharInfo(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "루트 단어 사전",
    description: "루트 음절에 대한 루트 단어, 돌림 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_루트단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadRouteWords(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "공격 단어 사전",
    description: "승리 음절에 대한 공격 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_승리단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadWinWords(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "필수 공격 단어 사전",
    description: "승리 음절에 대한 한 개의 공격 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_필수승리단어_${getCurrentDateTime()}.txt`;
      const blob = new Blob([WCDisplay.downloadWinWordsEssential(engine)], {
        type: "text/plain",
      });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    },
  },
  {
    name: "패배 단어 사전",
    description: "패배 음절에 대한 패배 단어 사전",
    action: (engine: WCEngine) => {
      const link = document.createElement("a");
      link.download = `끄글_패배단어_${getCurrentDateTime()}.txt`;
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
          className="gap-1 cursor-pointer select-none py-1"
        >
          <Download className="h-4 w-4" />
          단어 사전 다운로드
        </Badge>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>단어 사전 다운로드</DialogTitle>
          <DialogDescription>
            현재 설정된 룰에 대한 단어 사전을 다운로드합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {downloadOptions.map(({ name, action }, i) => (
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
