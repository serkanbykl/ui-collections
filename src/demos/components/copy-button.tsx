import { CopyButton } from "@/registry/kit/ui/copy-button";

const key = "bl_live_4f9c27e1a0d8";

export default function CopyButtonDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="surface flex items-center justify-between gap-3 rounded-card py-2.5 pr-2.5 pl-4">
        <code className="truncate font-mono text-sm">npm install @brightline/trace</code>
        <CopyButton value="npm install @brightline/trace" />
      </div>
      <div className="surface flex items-center justify-between gap-3 rounded-card py-2.5 pr-2.5 pl-4">
        <span className="min-w-0">
          <span className="block text-xs text-muted">Production API key</span>
          <code className="block truncate font-mono text-sm">{key}</code>
        </span>
        <CopyButton value={key} iconOnly label="Copy API key" variant="ghost" />
      </div>
    </div>
  );
}
