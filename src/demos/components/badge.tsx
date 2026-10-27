import { Badge } from "@/registry/kit/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex max-w-md flex-wrap items-center justify-center gap-2.5">
      <Badge>Preview</Badge>
      <Badge variant="solid">Production</Badge>
      <Badge variant="outline">v2.14.3</Badge>
      <Badge variant="accent">New</Badge>
      <Badge variant="success" dot>
        Ready
      </Badge>
      <Badge variant="warning" dot>
        Building
      </Badge>
      <Badge variant="danger" dot>
        Failed
      </Badge>
    </div>
  );
}
