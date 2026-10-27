import type { DemoMap } from "../types";
import ChartAreaDemo from "./chart-area";
import ChartBarDemo from "./chart-bar";
import ChartDonutDemo from "./chart-donut";
import ChartFunnelDemo from "./chart-funnel";
import ChartHeatmapDemo from "./chart-heatmap";
import ChartRadialMeterDemo from "./chart-radial-meter";
import ChartSparklineDemo from "./chart-sparkline";

export const chartDemos: DemoMap = {
  "chart-sparkline": ChartSparklineDemo,
  "chart-area": ChartAreaDemo,
  "chart-bar": ChartBarDemo,
  "chart-donut": ChartDonutDemo,
  "chart-radial-meter": ChartRadialMeterDemo,
  "chart-heatmap": ChartHeatmapDemo,
  "chart-funnel": ChartFunnelDemo,
};
