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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useWC } from "@/lib/store/useWC";
import { getMaxMinComponents } from "@/lib/wc/algorithms";
import { WCDisplay, WCEngine } from "@/lib/wc/WordChain";
import { useMemo } from "react";

import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";
export default function Statistics() {
  const [originalEngine, engine, exceptWords] = useWC((e) => [
    e.originalEngine,
    e.engine,
    e.exceptWords,
  ]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    originalEngine &&
    engine && (
      <>
        <div className=" h-full min-h-0 overflow-auto ">
          <div className="flex w-full text-left md:p-4 justify-center mb-[200px] md:mb-0">
            {exceptWords.length > 0 ? (
              <Tabs defaultValue="except" className="w-full">
                <TabsList className="m-3 mb-0 md:m-0">
                  <TabsTrigger value="except">단어 제거 후</TabsTrigger>
                  <TabsTrigger value="original">원본</TabsTrigger>
                </TabsList>
                <TabsContent value="except" className="p-0">
                  <Cards engine={engine} />
                </TabsContent>
                <TabsContent value="original" className="p-0">
                  <Cards engine={originalEngine} />
                </TabsContent>
              </Tabs>
            ) : (
              <Cards engine={engine} />
            )}
          </div>
        </div>
      </>
    )
  );
}

function Cards({ engine }: { engine: WCEngine }) {
  return (
    <div className="flex flex-col md:gap-4 w-full">
      <StatisticsHeader engine={engine} />

      <div className="flex-1 grid lg:grid-cols-3 lg:gap-4 md:grid-cols-2 md:gap-3 grid-cols-1 gap-4 p-4 md:p-0">
        {[
          {
            title: "주요 루트 수치 비교",
            desc: "현재 룰과 구엜룰 간 주요 루트 글자 수, 루트 단어 수 비교",
            content: <CompareRoute engine={engine} />,
          },
          {
            title: "글자 유형",
            desc: "승리, 패배, 루트 글자로 분류",
            content: <CharTypeChart engine={engine} />,
          },
          {
            title: "승리 글자 세부 유형",
            desc: "n턴 후 승리로 분류",
            content: <WinCharTypeChart engine={engine} />,
          },
          {
            title: "패배 글자 세부 유형",
            desc: "n턴 후 패배로 분류",
            content: <LosCharTypeChart engine={engine} />,
          },
          {
            title: "루트 글자 세부 유형",
            desc: "주요 루트 글자, 희귀 루트 글자로 분류",
            content: <RouteCharTypeChart engine={engine} />,
          },
        ].map(({ title, desc, content }, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="items-center">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center flex-1 justify-center">
              {content}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompareRoute({ engine }: { engine: WCEngine }) {
  const data = useMemo(() => {
    const routeChars = Object.keys(engine.chanGraph.nodes).filter(
      (e) => engine.chanGraph.nodes[e].type === "route"
    );

    const [maxRouteChars, _] = getMaxMinComponents(
      engine.chanGraph,
      engine.wordGraph,
      routeChars
    );
    const heads = engine.chanGraph.successors(maxRouteChars);
    const chars = maxRouteChars.length;
    const words = heads.reduce(
      (acc, curr) =>
        Object.keys(engine.wordGraph._succ[curr]).reduce(
          (acc2, curr2) => engine.wordGraph._succ[curr][curr2] + acc2,
          0
        ) +
        (engine.wordGraph.nodes[curr].loop ? 1 : 0) +
        acc,
      0
    );

    return [
      { data: "글자", "현재 룰": chars, 구엜룰: 88 },
      { data: "단어", "현재 룰": words, 구엜룰: 597 },
      {
        data: "단어/글자",
        "현재 룰": chars > 0 ? Math.round((words / chars) * 1000) / 1000 : 0,
        구엜룰: 6.784,
      },
    ];
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

function RouteCharTypeChart({ engine }: { engine: WCEngine }) {
  const chartData = useMemo(() => {
    return WCDisplay.routeCharTypeChartData(engine);
  }, [engine]);
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

function StatisticsHeader({ engine }: { engine: WCEngine }) {
  return (
    <div className="flex gap-2 items-center px-6 py-2 md:px-2 md:py-0">
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
          {engine.words.length.toLocaleString()}
        </div>
        <div>단어</div>
      </div>
      <div className="text-2xl font-thin text-muted-foreground">/</div>
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
          {Object.keys(engine.chanGraph.nodes).length.toLocaleString()}
        </div>
        <div>글자</div>
      </div>
    </div>
  );
}

function CharTypeChart({ engine }: { engine: WCEngine }) {
  const chartData = useMemo(() => {
    return WCDisplay.charTypeChartData(engine);
  }, [engine]);

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
    chartData &&
    (!chartData.every(({ num }) => num === 0) ? (
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
    ) : (
      <div className="text-muted-foreground">글자가 없습니다.</div>
    ))
  );
}

function WinCharTypeChart({ engine }: { engine: WCEngine }) {
  const chartData = useMemo(() => {
    return WCDisplay.winCharTypeChartData(engine);
  }, [engine]);

  return (
    chartData &&
    (!(chartData.data[0].endNum === "-1" && chartData.data[0].num === 0) ? (
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
    ) : (
      <div className="text-muted-foreground">승리 글자가 없습니다.</div>
    ))
  );
}
function LosCharTypeChart({ engine }: { engine: WCEngine }) {
  const chartData = useMemo(() => {
    return WCDisplay.losCharTypeChartData(engine);
  }, [engine]);

  return (
    chartData &&
    (!(chartData.data[0].endNum === "-1" && chartData.data[0].num === 0) ? (
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
    ) : (
      <div className="text-muted-foreground">패배 글자가 없습니다.</div>
    ))
  );
}
