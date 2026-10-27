import { Switch } from "@/registry/kit/ui/switch";

const options = [
  { id: "notify-deploys", label: "Deploy notifications", hint: "Email me when a production deploy finishes.", on: true },
  { id: "notify-comments", label: "Comment mentions", hint: "Only when someone mentions me.", on: false },
];

export default function SwitchDemo() {
  return (
    <div className="surface grid w-full max-w-md gap-1 rounded-card p-3">
      {options.map((o) => (
        <div key={o.id} className="flex items-center justify-between gap-6 rounded-field p-3">
          <label htmlFor={o.id} className="grid gap-0.5">
            <span className="text-sm">{o.label}</span>
            <span className="text-xs text-muted">{o.hint}</span>
          </label>
          <Switch id={o.id} defaultChecked={o.on} />
        </div>
      ))}
    </div>
  );
}
