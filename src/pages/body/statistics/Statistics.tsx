import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { WCDisplay } from "@/lib/wc/wordChain";
import { Square } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

export default function Statistics() {
  const originalEngine = useWC((e) => e.originalEngine);

  return originalEngine ? (
    <>
      <div className="flex flex-col p-5 h-full bg-muted/40 gap-5">
        <Header />

        <div className="flex-1 grid grid-cols-3 gap-5">
          <div>
            <ChartBox name="글자 유형" description="승리, 패배, 루트로 분류">
              <CharTypeChart />
            </ChartBox>
          </div>
          <div>
            <ChartBox
              name="승리 글자 세부 유형"
              description="n턴 후 승리, 조건부 승리로 분류"
            >
              <WinCharTypeChart />
            </ChartBox>
          </div>
          <div>
            <ChartBox
              name="패배 글자 세부 유형"
              description="n턴 후 패배, 조건부 패배로 분류"
            >
              <LosCharTypeChart />
            </ChartBox>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

function Header() {
  const originalEngine = useWC((e) => e.originalEngine);
  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-4xl">
          {originalEngine?.words.length.toLocaleString()}
        </div>
        <div>단어</div>
      </div>
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-4xl">
          {Object.keys(originalEngine!.charInfo).length.toLocaleString()}
        </div>
        <div>글자</div>
      </div>
    </div>
  );
}

function CharTypeChart() {
  const originalEngine = useWC((e) => e.originalEngine);
  const chartData = useMemo(() => {
    return originalEngine && WCDisplay.charTypeChartData(originalEngine!);
  }, [originalEngine]);
  const chartConfig: Record<string, { label: string; color?: string }> = {
    num: {
      label: "글자",
    },
    win: {
      label: "승리",
    },

    los: {
      label: "패배",
    },

    route: {
      label: "루트",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="flex-1 w-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData!}
              dataKey="num"
              nameKey="type"
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex gap-2">
        {chartData!.map((e) => (
          <TooltipProvider key={e.type}>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-sm" key={e.type}>
                  <Square fill={e.fill} strokeOpacity={0} className="w-4 h-4" />
                  <div className="text-muted-foreground hover:text-foreground transition-colors">
                    {chartConfig[e.type as string].label}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background">
                <p>{e.num}개</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function WinCharTypeChart() {
  const originalEngine = useWC((e) => e.originalEngine);
  const chartData = useMemo(() => {
    return originalEngine && WCDisplay.winCharTypeChartData(originalEngine!);
  }, [originalEngine]);

  return (
    chartData && (
      <ChartContainer config={chartData!.config} className="">
        <BarChart
          accessibilityLayer
          data={chartData.data}
          layout="vertical"
          margin={{
            left: 0,
          }}
        >
          <XAxis type="number" dataKey="num" hide />
          <YAxis
            dataKey="endNum"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              chartData.config[value as keyof typeof chartData.config]?.label
            }
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="endNum" hideLabel />}
          />
          <Bar dataKey="num" radius={5} />
        </BarChart>
      </ChartContainer>
    )
  );
}
function LosCharTypeChart() {
  const originalEngine = useWC((e) => e.originalEngine);
  const chartData = useMemo(() => {
    return originalEngine && WCDisplay.losCharTypeChartData(originalEngine!);
  }, [originalEngine]);

  return (
    chartData && (
      <ChartContainer config={chartData!.config} className="">
        <BarChart
          accessibilityLayer
          data={chartData.data}
          layout="vertical"
          margin={{
            left: 0,
          }}
        >
          <XAxis type="number" dataKey="num" hide />
          <YAxis
            dataKey="endNum"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              chartData.config[value as keyof typeof chartData.config]?.label
            }
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="endNum" hideLabel />}
          />
          <Bar dataKey="num" radius={5} />
        </BarChart>
      </ChartContainer>
    )
  );
}

function ChartBox({
  children,
  className,
  name,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  name?: string;
  description?: string;
}) {
  return (
    <div
      className={cn(
        "border-border border rounded-lg bg-background p-3 flex flex-col h-[300px]",
        className
      )}
    >
      <div className="font-semibold">{name}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
      {children}
    </div>
  );
}
