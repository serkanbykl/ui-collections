import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";

/** A backdrop for demos, so translucent surfaces have something behind them. */
export function PreviewStage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[24rem] items-center justify-center overflow-hidden rounded-card border border-line bg-bg-deep px-5 py-12 md:px-12",
        className,
      )}
    >
      <AuroraBackdrop />
      {children}
    </div>
  );
}
