import { ChartArea } from "@/registry/kit/ui/chart-area";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ChartAreaDemo() {
  return (
    <div className="surface w-full max-w-3xl rounded-card p-6">
      <h3 className="text-sm text-muted">Traffic by source</h3>
      <ChartArea
        className="mt-4"
        label="Monthly visitors by source, January to December"
        labels={months}
        series={[
          { name: "Organic", values: [12400, 13800, 13100, 15600, 17200, 16900, 18800, 20400, 19600, 22100, 23800, 25200] },
          { name: "Referral", values: [6200, 6900, 7400, 7100, 8300, 9100, 8800, 9600, 10400, 10100, 11200, 11900] },
        ]}
      />
    </div>
  );
}
