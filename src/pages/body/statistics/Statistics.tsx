import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useWC } from "@/lib/store/useWC";
import { WCDisplay } from "@/lib/wc/wordChain";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts";

export default function Statistics() {
  const engine = useWC((e) => e.engine);
  return engine ? (
    <>
      <div className="flex flex-col p-4 h-full">
        <Header />

        <div className="flex-1 grid grid-cols-3">
          <div>
            <CharTypeChart />
          </div>
          <div>
            <RouteComparisonChart />
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

function Header() {
  const engine = useWC((e) => e.engine);
  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
          {engine?.words.length.toLocaleString()}
        </div>
        <div>단어</div>
      </div>
      <div className="flex gap-1 items-end ">
        <div className="font-bold text-2xl">
          {Object.keys(engine!.charInfo).length.toLocaleString()}
        </div>
        <div>글자</div>
      </div>
    </div>
  );
}

function CharTypeChart() {
  const engine = useWC((e) => e.engine);
  const chartData = useMemo(() => {
    return engine && WCDisplay.charTypeChartData(engine!);
  }, [engine]);
  const chartConfig = {
    num: {
      label: "글자",
    },
    win: {
      label: "승리",
      color: "hsl(var(--win))",
    },
    wincir: {
      label: "조건부 승리",
      color: "hsl(var(--win) / 0.6))",
    },
    los: {
      label: "패배",
      color: "hsl(var(--los))",
    },
    loscir: {
      label: "조건부 패배",
      color: "hsl(var(--los) / 0.6)",
    },
    route: {
      label: "루트",
      color: "hsl(var(--route))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
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
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {Object.keys(engine!.charInfo).length.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      글자
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="type" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-foreground"
        />
      </PieChart>
    </ChartContainer>
  );
}
function RouteComparisonChart() {
  const engine = useWC((e) => e.engine);
  const chartData = useMemo(() => {
    return engine && WCDisplay.routeComparisonChartData(engine);
  }, [engine]);
  const chartConfig = {
    currentRule: { label: "현재 룰", color: "hsl(val(--foreground))" },
    guelRule: { label: "구엜룰", color: "hsl(val(--muted-foreground))" },
  };
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="data"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="currentRule" fill="hsl(val(--foreground))" radius={4} />
        <Bar
          dataKey="guelRule"
          fill="hsl(val(--muted-foreground))"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
// function TestChart() {
//   const chartData = [
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
//   ];
//   const chartConfig = {
//     desktop: {
//       label: "Desktop",
//       color: "hsl(var(--chart-1))",
//     },
//     mobile: {
//       label: "Mobile",
//       color: "hsl(var(--chart-2))",
//     },
//   } satisfies ChartConfig;
//   return (
//     <ChartContainer config={chartConfig}>
//       <BarChart accessibilityLayer data={chartData}>
//         <CartesianGrid vertical={false} />
//         <XAxis
//           dataKey="month"
//           tickLine={false}
//           tickMargin={10}
//           axisLine={false}
//           tickFormatter={(value) => value.slice(0, 3)}
//         />
//         <ChartTooltip
//           cursor={false}
//           content={<ChartTooltipContent indicator="dashed" />}
//         />
//         <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
//         <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//       </BarChart>
//     </ChartContainer>
//   );
// }
