import { Kbd, KbdGroup } from "@/registry/kit/ui/kbd";

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "⇧", "P"], label: "Promote to production" },
  { keys: ["G", "D"], label: "Go to deployments" },
];

export default function KbdDemo() {
  return (
    <dl className="surface grid w-full max-w-sm gap-1 rounded-card p-3">
      {shortcuts.map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-field px-3 py-2.5 text-sm">
          <dt className="text-fg/85">{s.label}</dt>
          <dd>
            <KbdGroup keys={s.keys} />
          </dd>
        </div>
      ))}
      <p className="px-3 pt-2 pb-1 text-xs text-muted">
        Press <Kbd>?</Kbd> anywhere to see all shortcuts.
      </p>
    </dl>
  );
}
