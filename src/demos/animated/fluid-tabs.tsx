import { FluidTabs } from "@/registry/kit/ui/fluid-tabs";

const panel = (title: string, body: string) => (
  <div className="surface max-w-md rounded-card p-6">
    <h3 className="font-display text-2xl tracking-[-0.02em]">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
  </div>
);

export default function FluidTabsDemo() {
  return (
    <FluidTabs
      aria-label="Project views"
      className="w-full max-w-md"
      items={[
        { value: "overview", label: "Overview", content: panel("Overview", "Traffic is up 12% week over week, led by organic search.") },
        { value: "deployments", label: "Deployments", content: panel("Deployments", "Three deploys today. The last one went live in 41 seconds.") },
        { value: "logs", label: "Logs", content: panel("Logs", "No errors in the last 24 hours. Two warnings about slow queries.") },
        { value: "settings", label: "Settings", content: panel("Settings", "Domains, environment variables and team access.") },
      ]}
    />
  );
}
