import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/kit/ui/select";

export default function SelectDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="runtime" className="text-sm text-muted">
        Runtime
      </label>
      <Select defaultValue="node-24">
        <SelectTrigger id="runtime">
          <SelectValue placeholder="Choose a runtime" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Node.js</SelectLabel>
            <SelectItem value="node-24">Node 24 (LTS)</SelectItem>
            <SelectItem value="node-22">Node 22</SelectItem>
            <SelectItem value="node-20" disabled>
              Node 20 (retired)
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="bun">Bun</SelectItem>
            <SelectItem value="deno">Deno</SelectItem>
            <SelectItem value="edge">Edge</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
