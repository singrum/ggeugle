import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className=" h-full bg-muted/40 min-h-0 overflow-auto">
        <div className="flex flex-col p-5 gap-5">
          <Header />

          <div className="flex-1 grid lg:grid-cols-3 lg:gap-5 md:grid-cols-2 md:gap-3 grid-cols-1 gap-2">
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
            </div>{" "}
            <div>
              <ChartBox
                name="루트 글자 세부 유형"
                description="주요 루트 글자, 희소 루트 글자로 분류"
              >
                <RouteCharTypeChart />
              </ChartBox>
            </div>{" "}
            <div>
              <ChartBox
                name="주요 루트 수치 비교"
                description="주요 루트 글자 수, 주요 루트 단어 수, 평균 루트 단어 수"
              >
                <CompareRoute />
              </ChartBox>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

function CompareRoute() {
  const originalEngine = useWC((e) => e.originalEngine);
  const data = useMemo(() => {
    if (originalEngine) {
      const routeChars = Object.keys(originalEngine.charInfo).filter(
        (e) => originalEngine.charInfo[e].type === "route"
      );
      const scc = originalEngine.getSCC();
      const maxRouteChars = scc.filter((e) => e.length >= 3).flat();
      const heads = originalEngine.chanGraph.successors(maxRouteChars);
      const chars = maxRouteChars.length;
      const words = heads.reduce(
        (acc, curr) =>
          Object.keys(originalEngine.wordGraph._succ[curr]).reduce(
            (acc2, curr2) => originalEngine.wordGraph._succ[curr][curr2] + acc2,
            0
          ) + acc,
        0
      );

      return [
        { data: "글자", "현재 룰": chars, 구엜룰: 88 },
        { data: "단어", "현재 룰": words, 구엜룰: 582 },
        {
          data: "단어/글자",
          "현재 룰": Math.round((words / chars) * 1000) / 1000,
          구엜룰: 6.614,
        },
      ];
    }
  }, []);
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="text-right">현재 룰</TableHead>
            <TableHead className="text-right">구엜룰</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{d.data}</TableCell>
              <TableCell className="text-right">{d["현재 룰"]}</TableCell>
              <TableCell className="text-right">{d["구엜룰"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}

function RouteCharTypeChart() {
  const originalEngine = useWC((e) => e.originalEngine);
  const chartData = useMemo(() => {
    return originalEngine && WCDisplay.routeCharTypeChartData(originalEngine!);
  }, [originalEngine]);

  return (
    chartData && (
      <div className="flex items-center justify-center gap-2 flex-1 min-h-0">
        <div className="flex items-center justify-center">
          <ChartContainer
            config={chartData!.config}
            className="aspect-square w-[230px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData!.data}
                dataKey="num"
                nameKey="name"
                strokeWidth={5}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    )
  );
}
function RouteWordTypeChart() {}

function Header() {
  const originalEngine = useWC((e) => e.originalEngine);
  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
          {originalEngine?.words.length.toLocaleString()}
        </div>
        <div>단어</div>
      </div>
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
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
    <div className="flex items-center justify-center gap-2 flex-1 min-h-0">
      <div className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-[230px]"
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
      <div className="flex gap-2 flex-col">
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
        "border-border border rounded-lg bg-background p-3 flex flex-col h-[300px] gap-2",
        className
      )}
    >
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
      <div className="min-h-0 h-full flex-1 flex justify-center flex-col">
        {children}
      </div>
    </div>
  );
}
