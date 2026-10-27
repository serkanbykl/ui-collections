import { ActivityList } from "@/registry/kit/ui/activity-list";

export default function ActivityListDemo() {
  return (
    <div className="surface w-full max-w-md rounded-card p-6">
      <h3 className="mb-5 font-display text-2xl tracking-[-0.02em]">Activity</h3>
      <ActivityList
        items={[
          { id: "1", actor: "Ada Park", action: "deployed", target: "api@a41c9e", time: "4 min ago", tone: "success" },
          { id: "2", actor: "Leo Varga", action: "opened a pull request in", target: "acme/web", time: "22 min ago", tone: "info" },
          { id: "3", actor: "Build bot", action: "failed to build", target: "worker@77d0b1", time: "1 h ago", tone: "danger" },
          { id: "4", actor: "Mina Okafor", action: "invited", target: "Sam Ruiz", time: "3 h ago", tone: "accent" },
          { id: "5", actor: "Iris Chen", action: "rotated the", target: "production API key", time: "Yesterday", tone: "warning" },
        ]}
      />
    </div>
  );
}
