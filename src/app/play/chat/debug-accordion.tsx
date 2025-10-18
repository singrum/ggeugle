import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWcStore } from "@/stores/wc-store";
import ReactMarkdown from "react-markdown";

export default function DebugAccordion({ debug }: { debug: string }) {
  const debugOpen = useWcStore((e) => e.debugOpen);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={debugOpen ? "d" : undefined}
    >
      <AccordionItem value="d" className="flex flex-col items-start">
        <AccordionTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-accent/50 -mx-1 items-center gap-3 rounded-full px-2 py-2 text-xs hover:no-underline [&_svg]:translate-y-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center">생각하는 과정 표시</div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="prose prose-sm dark:prose-invert space-y-1 overflow-hidden border-l-2 py-2 pb-4 pl-4">
          <ReactMarkdown>{debug}</ReactMarkdown>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
