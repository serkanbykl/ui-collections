import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";
import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";
import { Kbd } from "@/registry/kit/ui/kbd";

const bars = [38, 52, 44, 68, 59, 81, 74, 92, 86, 100];

export interface FeatureBentoProps {
  title?: string;
  description?: string;
}

export function FeatureBento({
  title = "Built for the way teams actually work.",
  description = "Insights, automation and collaboration in one place, each a tap away.",
}: FeatureBentoProps) {
  return (
    <section className="relative isolate overflow-hidden bg-bg-deep px-6 py-24 text-fg md:px-8 md:py-32">
      <AuroraBackdrop grid={false} className="opacity-60" />
      <div className="mx-auto max-w-7xl">
        <TextReveal as="h2" trigger="view" className="max-w-3xl font-display text-4xl leading-[1.02] md:text-6xl">
          {title}
        </TextReveal>
        <Reveal as="p" delay={150} className="mt-5 max-w-xl text-lg text-muted">
          {description}
        </Reveal>

        <div className="mt-14 grid auto-rows-[minmax(14rem,auto)] gap-4 md:grid-cols-6">
          <SpotlightCard className="p-7 md:col-span-4">
            <div>
              <h3 className="text-lg font-medium">Live insights</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">Throughput, cycle time and focus hours, updated as work moves.</p>
            </div>
            <div aria-hidden className="mt-auto flex h-32 items-end gap-2 pt-8">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-[calc(var(--r-field)*0.5)] bg-linear-to-t from-accent/20 to-accent/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7 md:col-span-2">
            <h3 className="text-lg font-medium">Automations run</h3>
            <div className="mt-auto pt-6">
              <div className="font-display text-6xl">
                <NumberTicker value={12483} />
              </div>
              <p className="mt-2 text-sm text-muted">this month, zero cron jobs written.</p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7 md:col-span-2">
            <h3 className="text-lg font-medium">Shared inbox</h3>
            <p className="mt-2 text-sm text-muted">Requests from Slack, email and forms land in one queue.</p>
            <div aria-hidden className="mt-auto pt-6">
              <AvatarGroup size="sm">
                {["Ada Kaya", "Mina Reyes", "Jon Lee", "Sam Ortiz"].map((name) => (
                  <Avatar key={name} alt={name} size="sm" />
                ))}
              </AvatarGroup>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7 md:col-span-4">
            <h3 className="text-lg font-medium">Command everything</h3>
            <p className="mt-2 max-w-md text-sm text-muted">Press ⌘K anywhere to jump, assign, or ship without leaving the keyboard.</p>
            <div aria-hidden className="surface mt-auto flex items-center gap-3 rounded-field px-4 py-3 text-sm text-fg/70">
              <Kbd>⌘K</Kbd>
              Assign “Edge cache for /pricing” to…
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
