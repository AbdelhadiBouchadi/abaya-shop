import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="bg-[#fffdfa] min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-360 px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Column Skeleton */}
          <div className="basis-3/5">
            <Skeleton className="aspect-3/4 w-full rounded-xl bg-[#f4f1ed]" />
            <div className="grid grid-cols-5 gap-4 mt-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-3/4 rounded-lg bg-[#f4f1ed]"
                />
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="basis-2/5 space-y-8">
            <Skeleton className="h-12 w-3/4 bg-[#f4f1ed]" /> {/* Title */}
            <Skeleton className="h-8 w-32 bg-[#f4f1ed]" /> {/* Price */}
            <div className="space-y-4 pt-8">
              <Skeleton className="h-6 w-24 bg-[#f4f1ed]" />{' '}
              {/* Option Title */}
              <div className="flex gap-3">
                <Skeleton className="h-10 w-16 rounded-lg bg-[#f4f1ed]" />
                <Skeleton className="h-10 w-16 rounded-lg bg-[#f4f1ed]" />
              </div>
            </div>
            <div className="pt-8">
              <Skeleton className="h-14 w-full rounded-full bg-[#f4f1ed]" />{' '}
              {/* ATC Button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
