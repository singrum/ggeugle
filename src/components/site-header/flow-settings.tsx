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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsTablet } from "@/hooks/use-tablet";

import { flowInfo } from "@/constants/rule";
import { useWcStore } from "@/stores/wc-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRight, Workflow } from "lucide-react";
import { Fragment, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
export default function FlowSettings() {
  const [open, setOpen] = useState(false);
  const isTablet = useIsTablet();

  if (!isTablet) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild className="size-9">
            <DialogTrigger
              asChild
              id="precedence-dialog-trigger"
              className="size-9"
            >
              <Button variant="ghost" size="icon" className="size-9">
                <Workflow className="stroke-foreground" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>알고리즘 플로우 설정</TooltipContent>
        </Tooltip>
        <DialogContent className="flex h-full max-h-130 flex-col overflow-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>알고리즘 플로우 설정</DialogTitle>
            <VisuallyHidden>
              <DialogDescription></DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <FlowSettingsForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size={"icon"} id="precedence-dialog-trigger">
          <Workflow className="stroke-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader className="text-left">
          <DrawerTitle className="px-2 text-left">
            알고리즘 플로우 설정
          </DrawerTitle>
          <VisuallyHidden>
            <DrawerDescription></DrawerDescription>
          </VisuallyHidden>
        </DrawerHeader>
        <div className="flex-1 overflow-auto px-6 pb-6">
          <FlowSettingsForm setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FlowSettingsForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const setFlow = useWcStore((e) => e.setFlow);
  const flow = useWcStore((e) => e.flow);
  const [localFlow, setLocalFlow] = useState(flow);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="space-y-6 py-4">
        {flowInfo.map(({ title, pipeline, key }) => (
          <Label key={key} className="flex items-start gap-3 rounded-lg">
            <Checkbox
              checked={localFlow === key}
              onCheckedChange={() => setLocalFlow(key)}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">{title}</p>
              <p className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
                (
                {pipeline.map((e, i) => (
                  <Fragment key={i}>
                    <span>{e}</span>
                    {pipeline.length - 1 !== i && (
                      <ChevronRight className="stroke-muted-foreground size-4 stroke-1" />
                    )}
                  </Fragment>
                ))}
                ) 반복
              </p>
            </div>
          </Label>
        ))}
      </div>

      <Button
        size="lg"
        onClick={() => {
          setOpen(false);
          setFlow(localFlow);
        }}
      >
        저장
      </Button>
    </div>
  );
}
