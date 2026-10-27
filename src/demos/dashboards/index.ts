import type { DemoMap } from "../types";
import DashboardAnalyticsDemo from "./dashboard-analytics";
import DashboardDevopsDemo from "./dashboard-devops";
import DashboardFinanceDemo from "./dashboard-finance";

export const dashboardDemos: DemoMap = {
  "dashboard-analytics": DashboardAnalyticsDemo,
  "dashboard-finance": DashboardFinanceDemo,
  "dashboard-devops": DashboardDevopsDemo,
};
