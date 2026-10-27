import { NotificationBell, type NotificationItem } from "@/registry/kit/ui/notification-bell";

const items: NotificationItem[] = [
  { id: "n1", title: "Priya Raman mentioned you", detail: "“Can you check the October cohort before Friday?”", time: "4 min ago", tone: "accent" },
  { id: "n2", title: "exports is degraded", detail: "Large CSV exports take 3× longer. A fix is deploying.", time: "12 min ago", tone: "warning" },
  { id: "n3", title: "Payment received from Polaris", detail: "Invoice INV-2041 · $1,284.00", time: "1 h ago", tone: "success" },
  { id: "n4", title: "Jonas Lindqvist joined Growth", time: "Yesterday", read: true },
];

export default function NotificationBellDemo() {
  return (
    <div className="surface flex w-full max-w-lg items-center justify-between gap-3 rounded-card px-4 py-3">
      <p className="text-sm font-medium">Top bar</p>
      <div className="flex items-center gap-2">
        <NotificationBell variant="chip" items={items} />
        <NotificationBell items={items} viewAllHref="#notifications" />
      </div>
    </div>
  );
}
