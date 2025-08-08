import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  GhostTabs,
  GhostTabsContent,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsTablet } from "@/hooks/use-tablet";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type { PrecedenceMaps } from "@/types/search";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import DefaultPrecedenceRule from "./default-precedence-rule";
export default function SearchPredecenceSettings() {
  const [open, setOpen] = useState(false);
  const isTablet = useIsTablet();

  if (!isTablet) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild id="precedence-dialog-trigger">
              <Button variant="ghost" size="icon">
                <FileSpreadsheet />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>전략 탐색 우선순위 편집</TooltipContent>
        </Tooltip>
        <DialogContent className="flex h-full max-h-130 flex-col sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>전략 탐색 우선순위 편집</DialogTitle>
            <VisuallyHidden>
              <DialogDescription></DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <PrecedenceSettingsForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size={"default"} id="precedence-dialog-trigger">
          <FileSpreadsheet />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader className="text-left">
          <DrawerTitle className="px-2 text-left">
            전략 탐색 우선순위 편집
          </DrawerTitle>
          <VisuallyHidden>
            <DrawerDescription></DrawerDescription>
          </VisuallyHidden>
        </DrawerHeader>
        <div className="flex-1 overflow-auto px-6">
          <PrecedenceSettingsForm setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function PrecedenceSettingsForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const precedenceMaps = useWcStore((s) => s.precedenceMaps);

  const [edgeString, setEdgeString] = useState<string>(
    JSON.stringify(precedenceMaps.edge, null, 2),
  );
  const [nodeString, setNodeString] = useState<string>(
    JSON.stringify(precedenceMaps.node, null, 2),
  );
  const [edgeValid, setEdgeValid] = useState<boolean>(true);
  const [nodeValid, setNodeValid] = useState<boolean>(true);
  const [parsedEdge, setParsedEdge] = useState<object | null>(
    precedenceMaps.edge,
  );
  const [parsedNode, setParsedNode] = useState<object | null>(
    precedenceMaps.node,
  );

  function isValidEdge(
    obj: object,
  ): obj is Record<string, Record<string, number>> {
    if (typeof obj !== "object" || obj === null) return false;
    return Object.values(obj).every(
      (inner) =>
        typeof inner === "object" &&
        inner !== null &&
        Object.values(inner).every((v) => typeof v === "number"),
    );
  }

  function isValidNode(obj: object): obj is Record<string, number> {
    if (typeof obj !== "object" || obj === null) return false;
    return Object.values(obj).every((v) => typeof v === "number");
  }

  const handleEdgeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEdgeString(val);
    try {
      const parsed = JSON.parse(val);
      const valid = isValidEdge(parsed);
      setEdgeValid(valid);
      setParsedEdge(valid ? parsed : null);
    } catch {
      setEdgeValid(false);
      setParsedEdge(null);
    }
  };

  const handleNodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNodeString(val);
    try {
      const parsed = JSON.parse(val);
      const valid = isValidNode(parsed);
      setNodeValid(valid);
      setParsedNode(valid ? parsed : null);
    } catch {
      setNodeValid(false);
      setParsedNode(null);
    }
  };

  const save = () => {
    if (edgeValid && parsedEdge) {
      useWcStore.setState((state) => {
        state.precedenceMaps.edge = parsedEdge as PrecedenceMaps["edge"];
      });
      setOpen(false);
    }
    if (nodeValid && parsedNode) {
      useWcStore.setState((state) => {
        state.precedenceMaps.node = parsedNode as PrecedenceMaps["node"];
      });
      setOpen(false);
    }
  };

  return (
    <div className="h-full flex-1 space-y-4">
      <GhostTabs defaultValue="default" className="h-full space-y-0">
        <GhostTabsList>
          <GhostTabsTrigger value="default">기본</GhostTabsTrigger>
          <GhostTabsTrigger value="edge">단어</GhostTabsTrigger>
          <GhostTabsTrigger value="node">음절</GhostTabsTrigger>
        </GhostTabsList>

        <GhostTabsContent value="default" className="mt-4 mb-6 lg:mb-0">
          <DefaultPrecedenceRule />
        </GhostTabsContent>

        <GhostTabsContent
          value="edge"
          className="mt-4 mb-6 flex flex-col gap-2 lg:mb-0"
        >
          <div className="text-muted-foreground text-sm">
            숫자가 작을수록 우선순위가 높아요.(기본값 0)
          </div>
          <div className="h-64">
            <Textarea
              id={"word"}
              value={edgeString}
              onChange={handleEdgeChange}
              className="h-full max-h-full min-h-0 resize-none overflow-y-auto rounded-xl border bg-transparent p-4 font-sans leading-6"
              aria-invalid={!edgeValid}
              placeholder={`예: {\n  "가": { "나": 1 }\n}`}
            />
          </div>
          <div
            className={cn(
              "text-sm",
              edgeValid ? "text-primary" : "text-destructive",
            )}
          >
            {edgeValid
              ? "유효한 단어 우선순위 구조입니다."
              : "유효하지 않은 단어 우선순위 구조입니다."}
          </div>
          <Button onClick={save} disabled={!edgeValid}>
            저장
          </Button>
        </GhostTabsContent>

        <GhostTabsContent
          value="node"
          className="mt-4 mb-6 flex flex-col gap-2 lg:mb-0"
        >
          <div className="text-muted-foreground text-sm">
            숫자가 작을수록 우선순위가 높아요.(기본값 0)
          </div>
          {/* <div className="h-64 overflow-hidden border border-red-500">
            <textarea
              className="box-border h-full max-h-full min-h-0 w-full resize-none overflow-y-auto"
              placeholder="test"
            ></textarea>
          </div> */}
          <div className="h-64">
            <Textarea
              value={nodeString}
              onChange={handleNodeChange}
              className="h-full max-h-full min-h-0 resize-none overflow-y-auto rounded-xl border bg-transparent p-4 font-sans leading-6"
              aria-invalid={!nodeValid}
              placeholder={`예: {\n  "가": 1,\n  "나": 2\n}`}
            />
          </div>
          <div
            className={cn(
              "text-sm",
              nodeValid ? "text-primary" : "text-destructive",
            )}
          >
            {nodeValid
              ? "유효한 음절 우선순위 구조입니다."
              : "유효하지 않은 음절 우선순위 구조입니다."}
          </div>
          <Button onClick={save} disabled={!nodeValid}>
            저장
          </Button>
        </GhostTabsContent>
      </GhostTabs>
    </div>
  );
}
