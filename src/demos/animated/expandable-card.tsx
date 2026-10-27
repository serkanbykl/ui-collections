import { ExpandableCards } from "@/registry/kit/ui/expandable-card";

const items = [
  {
    id: "edge",
    title: "Edge functions",
    meta: "Runtime · 12 regions",
    summary: "Run code close to every visitor with cold starts under 50 ms.",
    content: (
      <div className="space-y-3">
        <p>Functions deploy to every region automatically and scale to zero when idle.</p>
        <p>Streaming responses, WebSockets and scheduled jobs are supported out of the box. Logs stream to your dashboard in real time.</p>
      </div>
    ),
  },
  {
    id: "storage",
    title: "Object storage",
    meta: "Storage · S3 compatible",
    summary: "Durable buckets with signed URLs and automatic image resizing.",
    content: (
      <div className="space-y-3">
        <p>Every object is replicated across three zones. Lifecycle rules move cold data to cheaper tiers.</p>
        <p>Use any S3 client, or the built-in upload widget with resumable transfers.</p>
      </div>
    ),
  },
];

export default function ExpandableCardDemo() {
  return <ExpandableCards items={items} className="w-full max-w-2xl" />;
}
