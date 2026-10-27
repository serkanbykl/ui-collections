import { Button } from "@/registry/kit/ui/button";

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="xl">Start free trial</Button>
        <Button variant="solid" size="lg">
          Get started
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm">Invite</Button>
        <Button>Redeploy</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="accent" size="xs">
          Mark as read
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="icon-xs" aria-label="Next page">
          {arrow}
        </Button>
        <Button size="icon-sm" aria-label="Next page">
          {arrow}
        </Button>
        <Button size="icon" aria-label="Next page" className="[&_svg]:size-[18px]">
          {arrow}
        </Button>
        <Button size="icon-lg" aria-label="Next page">
          {arrow}
        </Button>
      </div>
    </div>
  );
}
