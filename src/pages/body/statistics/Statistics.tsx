import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { WCDisplay } from "@/lib/wc/wordChain";
import { useMemo } from "react";
import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";

export default function Statistics() {
  const originalEngine = useWC((e) => e.originalEngine);

  return originalEngine ? (
    <>
      <div className=" h-full bg-muted/40 min-h-0 overflow-auto">
        <div className="flex flex-col p-5 gap-5">
          <Header />

          <div className="flex-1 grid lg:grid-cols-3 lg:gap-5 md:grid-cols-2 md:gap-3 grid-cols-1 gap-2">
            {[
              {
                title: "글자 유형",
                desc: "승리, 패배, 루트 글자로 분류",
                content: <CharTypeChart />,
              },
              {
                title: "승리 글자 세부 유형",
                desc: "n턴 후 승리, 조건부 승리로 분류",
                content: <WinCharTypeChart />,
              },
              {
                title: "패배 글자 세부 유형",
                desc: "n턴 후 패배, 조건부 패배로 분류",
                content: <LosCharTypeChart />,
              },
              {
                title: "루트 글자 세부 유형",
                desc: "주요 루트 글자, 희귀 루트 글자로 분류",
                content: <RouteCharTypeChart />,
              },
              {
                title: "루트 수치 비교",
                desc: "현재 룰과 구엜룰 비교",
                content: <CompareRoute />,
              },
            ].map(({ title, desc, content }) => (
              <Card className="flex flex-col gap-2">
                <CardHeader className="items-center pb-0">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center flex-1 justify-center">
                  {content}
                </CardContent>
              </Card>
            ))}
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
          "현재 룰": chars > 0 ? Math.round((words / chars) * 1000) / 1000 : 0,
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
    chartData &&
    (chartData.data[0].num > 0 || chartData.data[1].num > 0 ? (
      <ChartContainer
        config={chartData!.config}
        className="aspect-square  max-w-[300px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Pie
            data={chartData!.data}
            dataKey="num"
            nameKey="name"
            strokeWidth={5}
          />
        </PieChart>
      </ChartContainer>
    ) : (
      <div className="text-center text-muted-foreground">
        루트 글자가 없습니다.
      </div>
    ))
  );
}

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
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-w-[300px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie data={chartData!} dataKey="num" nameKey="type" strokeWidth={5} />
      </PieChart>
    </ChartContainer>
  );
}

function WinCharTypeChart() {
  const originalEngine = useWC((e) => e.originalEngine);
  const chartData = useMemo(() => {
    return originalEngine && WCDisplay.winCharTypeChartData(originalEngine!);
  }, [originalEngine]);

  return (
    chartData && (
      <ChartContainer config={chartData!.config} className="w-full">
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
      <ChartContainer config={chartData!.config} className="w-full">
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
