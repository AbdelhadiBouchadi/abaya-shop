import React from 'react';

const skeletonText = 'mb-3 h-4 w-5/6 animate-pulse rounded bg-[#e8e0d9]';
const skeletonTitle = 'mb-4 h-4 w-24 animate-pulse rounded bg-[#dcd0c6]';

export default function Loading() {
  return (
    <div className="bg-[#fffdfa] min-h-screen pt-24 md:pt-32 pb-20">
      <div className="mx-auto flex max-w-360 flex-col gap-8 px-6 lg:flex-row lg:items-start">
        {/* --- SIDEBAR SKELETON --- */}
        <aside className="h-fit space-y-8 lg:sticky lg:top-[18vh] lg:w-64 hidden lg:block">
          {/* Section 1: Collections */}
          <div>
            <div className={skeletonTitle} /> {/* Title */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className={skeletonText} />
            ))}
          </div>

          {/* Separator */}
          <div className="w-full h-px bg-[#b88d6a]/20 my-6" />

          {/* Section 2: Sort/Filter */}
          <div>
            <div className={skeletonTitle} /> {/* Title */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className={skeletonText} />
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT SKELETON --- */}
        <div className="order-last min-h-screen w-full flex-1">
          {/* Results Count Text */}
          <div className="mb-8 h-5 w-48 animate-pulse rounded bg-[#dcd0c6]" />

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4">
                {/* Image Aspect Ratio */}
                <div className="aspect-3/4 w-full animate-pulse rounded-xl bg-[#f4f1ed]" />

                {/* Product Info Lines */}
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#e8e0d9]" />{' '}
                  {/* Title */}
                  <div className="h-4 w-1/4 animate-pulse rounded bg-[#e8e0d9]" />{' '}
                  {/* Price */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
