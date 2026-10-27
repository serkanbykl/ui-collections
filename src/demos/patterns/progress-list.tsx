import { ProgressList } from "@/registry/kit/ui/progress-list";

export default function ProgressListDemo() {
  return (
    <div className="surface w-full max-w-md rounded-card p-6">
      <h3 className="mb-5 font-display text-2xl tracking-[-0.02em]">Storage by project</h3>
      <ProgressList
        ranked
        items={[
          { id: "web", label: "acme/web", meta: "18.4 of 20 GB", value: 0.92, tone: "danger" },
          { id: "api", label: "acme/api", meta: "12.1 of 20 GB", value: 0.61, tone: "warning" },
          { id: "docs", label: "acme/docs", meta: "7.6 of 20 GB", value: 0.38, tone: "accent" },
          { id: "mobile", label: "acme/mobile", meta: "3.0 of 20 GB", value: 0.15, tone: "success" },
        ]}
      />
    </div>
  );
}
