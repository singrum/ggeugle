import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";

const chartConfig = {
  num: {
    label: "개수",
  },
  win: {
    label: "승리",
    color: "var(--win)",
  },
  lose: {
    label: "패배",
    color: "var(--lose)",
  },
  loopwin: {
    label: "순환",
    color: "var(--loopwin)",
  },
  route: {
    label: "루트",
    color: "var(--route)",
  },
} satisfies ChartConfig;

export default function NodeTypeNumChart({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const chartData = useMemo(() => {
    return solver.graphSolver.getNodeTypeNum(view);
  }, [solver, view]);
  const total = chartData.reduce((prev, curr) => prev + curr.num, 0);
  return (
    <Card className="bg-card h-full border">
      <CardHeader className="items-center pb-0">
        <CardTitle>{total.toLocaleString()} 음절</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full pb-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              isAnimationActive={false}
              // label
              data={chartData}
              dataKey="num"
              nameKey="nodeType"
            />
            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent nameKey="nodeType" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
