import { Skeleton, SkeletonText } from "@/registry/kit/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="surface grid w-full max-w-sm gap-5 rounded-card p-6" aria-busy="true" aria-label="Loading project">
      <div className="flex items-center gap-4">
        <Skeleton shape="circle" className="size-12" />
        <div className="grid flex-1 gap-2">
          <Skeleton shape="text" className="w-2/3" />
          <Skeleton shape="text" className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-28" />
      <SkeletonText lines={3} />
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-control" />
        <Skeleton className="h-9 w-20 rounded-control" />
      </div>
    </div>
  );
}
