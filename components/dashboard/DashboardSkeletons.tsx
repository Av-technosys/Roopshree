import {
  DashboardCard,
  DashboardPageTitle,
} from "@/components/dashboard/DashboardPrimitives";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[#ead8c4] ${className}`} />;
}

export function OrderCardSkeleton() {
  return (
    <article className="overflow-hidden border border-[#e5d2bd] bg-white shadow-sm">
      <div className="grid gap-3 bg-[#f1dfc7] px-4 py-3 sm:grid-cols-[1fr_0.8fr_0.8fr_auto] sm:items-center">
        {/* <SkeletonBlock className="h-8 w-36" />
        <SkeletonBlock className="h-8 w-28" />
        <SkeletonBlock className="h-8 w-24" />
        <SkeletonBlock className="h-7 w-24 rounded-full" /> */}
      </div>
      <div className="grid gap-4 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="space-y-3">
          <SkeletonBlock className="h-6 w-44" />
          <div className="grid gap-2 sm:grid-cols-3">
            <SkeletonBlock className="h-9 w-full" />
            <SkeletonBlock className="h-9 w-full" />
            <SkeletonBlock className="h-9 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <SkeletonBlock className="h-10 w-full sm:w-28" />
          <SkeletonBlock className="h-10 w-full sm:w-28" />
        </div>
      </div>
    </article>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div>
      <SkeletonBlock className="hidden h-8 w-40 lg:block" />
      <section className="mt-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mt-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <DashboardCard key={index} className="p-5">
            <div className="flex items-start justify-between">
              {/* <SkeletonBlock className="size-5" />
              <SkeletonBlock className="size-4" /> */}
            </div>
            <SkeletonBlock className="mt-5 h-8 w-16" />
            <SkeletonBlock className="mt-2 h-4 w-24" />
          </DashboardCard>
        ))}
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="space-y-5">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </section>
        <DashboardCard className="h-fit bg-[#432414] p-4">
          <SkeletonBlock className="h-5 w-32 bg-white/25" />
          {/* <SkeletonBlock className="mt-7 h-6 w-20 rounded-full bg-white/25" />
          <SkeletonBlock className="mt-4 h-5 w-36 bg-white/25" /> */}
          <SkeletonBlock className="mt-3 h-4 w-28 bg-white/25" />
          <SkeletonBlock className="mt-3 h-16 w-full bg-white/25" />
        </DashboardCard>
      </div>
    </div>
  );
}

export function DashboardOrdersSkeleton() {
  return (
    <div>
      <DashboardPageTitle>Recent Orders</DashboardPageTitle>
      <div className="mt-5 flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-5 space-y-5">
        {Array.from({ length: 1 }).map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function DashboardGenericSkeleton() {
  return (
    <div>
      <SkeletonBlock className="hidden h-8 w-48 lg:block" />
      <DashboardCard className="mt-5 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-2 h-10 w-full" />
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
