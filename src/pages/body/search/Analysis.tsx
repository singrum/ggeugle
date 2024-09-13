import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import DFSAnalysis from "./analysis/DFSAnalysis";
import IDSAnalysis from "./analysis/IDSAnalysis";
const methods = [
  { name: "깊이 우선 탐색", component: <DFSAnalysis /> },
  { name: "깊이 심화 탐색", component: <IDSAnalysis /> },
];

export default function Analysis() {
  const [method, setMethod] = useState<number>(0);

  return (
    <Tabs defaultValue="0">
      <TabsList className="h-7 rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
        {methods.map(({ name }, i) => (
          <TabsTrigger
            key={i}
            value={`${i}`}
            className="data-[state=active]:shadow h-[1.45rem] rounded-sm px-2 text-xs"
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {methods.map(({ component }, i) => (
        <TabsContent key={i} value={`${i}`} className="w-full">
          {component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
