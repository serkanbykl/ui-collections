import { InlineEdit } from "@/registry/kit/ui/inline-edit";

export default function InlineEditDemo() {
  return (
    <div className="surface grid w-full max-w-md gap-2 rounded-card p-7">
      <div className="text-xs tracking-[0.18em] text-muted uppercase">Project</div>
      <InlineEdit label="Project name" defaultValue="Northern lights" className="font-display text-4xl tracking-[-0.02em]" />
      <InlineEdit label="Description" placeholder="Add a description" className="text-sm text-muted" />
    </div>
  );
}
