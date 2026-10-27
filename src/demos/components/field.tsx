import { Button } from "@/registry/kit/ui/button";
import { Input, Textarea } from "@/registry/kit/ui/field";

export default function FieldDemo() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <form className="surface grid gap-4 rounded-card p-6">
        <Input label="Name" name="name" autoComplete="name" />
        <Input label="Email" name="email" type="email" defaultValue="hello@" error="Enter a full email address." />
        <Textarea label="Message" name="message" hint="A few sentences is enough." rows={4} />
      </form>
      <div className="surface grid gap-4 rounded-card p-6">
        <div className="flex items-end gap-2">
          <Input size="sm" label="Coupon" name="coupon" className="min-w-0 flex-1" />
          <Button size="sm">Apply</Button>
        </div>
        <div className="flex items-end gap-2">
          <Input size="md" label="Invite by email" name="invite" type="email" className="min-w-0 flex-1" />
          <Button variant="accent">Send invite</Button>
        </div>
        <Input size="xs" label="Tag" name="tag" hint="Extra small, for dense tables and filters." />
        <Input size="xl" label="Workspace name" name="workspace" />
      </div>
    </div>
  );
}
