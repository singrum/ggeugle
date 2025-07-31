import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  num: {
    label: "음절 수",
  },
  win: {
    label: "승리",
    color: "var(--win)",
  },
  lose: {
    label: "패배",
    color: "var(--lose)",
  },
} satisfies ChartConfig;

export default function WinloseDetailChart({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);

  const data = useMemo(() => {
    return solver.graphSolver.getWinloseDetailNumData(view);
  }, [solver, view]);

  return (
    <Card className="bg-card h-full border">
      <CardHeader className="items-center pb-0">
        <CardTitle>깊이 별 음절 개수</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="depth"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="num"
                  labelFormatter={(_, v2) => {
                    return (
                      v2[0].payload.depth +
                      " 수 이내 " +
                      (v2[0].payload.type === "win" ? "승리" : "패배")
                    );
                  }}
                />
              }
            />
            <Bar dataKey={"num"} radius={4} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
