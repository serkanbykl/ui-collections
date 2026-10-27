import { AppWindow } from "@/registry/kit/ui/app-window";
import { Badge } from "@/registry/kit/ui/badge";

const deploys = [
  { branch: "main", commit: "Add rollback button to deploy list", when: "4 min ago", status: "Live" },
  { branch: "fix/search-timeout", commit: "Cap search query at 800 ms", when: "38 min ago", status: "Preview" },
  { branch: "main", commit: "Move invoices to the new PDF renderer", when: "2 h ago", status: "Replaced" },
];

export default function AppWindowDemo() {
  return (
    <AppWindow url="deploys.brightline.example/web-shop" className="w-full max-w-2xl">
      <ul className="divide-y divide-line">
        {deploys.map((d) => (
          <li key={d.commit} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{d.commit}</p>
              <p className="truncate text-xs text-muted">
                {d.branch} · {d.when}
              </p>
            </div>
            <Badge variant={d.status === "Live" ? "success" : d.status === "Preview" ? "info" : "outline"}>{d.status}</Badge>
          </li>
        ))}
      </ul>
    </AppWindow>
  );
}
