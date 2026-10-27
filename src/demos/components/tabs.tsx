import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/kit/ui/tabs";

const panels = [
  { value: "overview", label: "Overview", body: "Three deploys today, all healthy. The last build finished in 41 seconds." },
  { value: "logs", label: "Logs", body: "No errors in the past 24 hours. 12 warnings, mostly about cache headers." },
  { value: "settings", label: "Settings", body: "Builds run on Node 24 with a 2 GB memory limit." },
];

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList aria-label="Project">
        {panels.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((p) => (
        <TabsContent key={p.value} value={p.value} className="surface rounded-card p-6 text-sm leading-relaxed text-muted">
          {p.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}
