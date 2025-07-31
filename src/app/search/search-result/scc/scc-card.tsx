import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NodeName } from "@/lib/wordchain/graph/graph";
import { useWcStore } from "@/stores/wc-store";
import { Fragment } from "react/jsx-runtime";

const MAX_DISPLAY = 3;
export default function SccCard({ nodes }: { nodes: NodeName[] }) {
  const smallNodes = nodes.slice(0, MAX_DISPLAY);
  const search = useWcStore((e) => e.search);
  return (
    <Card className={"bg-muted/50 w-fit border-0 px-3 py-1"}>
      <div className="flex gap-1">
        <div className="flex items-center">
          {smallNodes.map((e, i) => (
            <Fragment key={e}>
              <CharButton>{e}</CharButton>
              {smallNodes.length - 1 !== i && <span>,</span>}
            </Fragment>
          ))}
        </div>
        {nodes.length > MAX_DISPLAY && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                size="sm"
                className="text-muted-foreground -mx-1 px-2 text-xs"
              >
                +{nodes.length - MAX_DISPLAY}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-wrap items-center">
              {nodes.map((e) => (
                <Button
                  onClick={() => {
                    search(e);
                  }}
                  key={e}
                  className="size-8"
                  variant="ghost"
                >
                  {e}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </Card>
  );
}

function CharButton({ children }: React.ComponentProps<"button">) {
  const search = useWcStore((e) => e.search);
  return (
    <Button
      variant={"link"}
      className="text-foreground size-8 w-fit px-1"
      onClick={() => {
        search(children as string);
      }}
    >
      {children}
    </Button>
  );
}
