'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductOption, ProductVariant } from '@/lib/shopify/types';
import { cn, createUrl } from '@/lib/utils';

export function ProductVariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  return options.map((option) => (
    <div key={option.id} className="mb-6">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#3E2723]">
        {option.name}
      </h3>
      <div className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();

          // 1. Base the new URL params on the current URL
          const optionParams = new URLSearchParams(searchParams.toString());
          // 2. Update ONLY the current option to the value being rendered
          optionParams.set(optionNameLowerCase, value);

          const optionUrl = createUrl(pathname, optionParams);

          // 3. LOGIC: Find if a variant exists for this specific combination of params
          // We check if there is a variant where EVERY option matches the `optionParams`
          const matchingVariant = variants.find((variant) =>
            variant.selectedOptions.every((vOption) => {
              const paramValue = optionParams.get(vOption.name.toLowerCase());
              // If the param is missing (e.g. first load), we can't strictly match,
              // but usually the page redirects to a default variant so params exist.
              return paramValue === vOption.value;
            })
          );

          // 4. Determine States
          const isActive = searchParams.get(optionNameLowerCase) === value;
          const isAvailableForSale = matchingVariant?.availableForSale;
          const isExists = !!matchingVariant;

          // If the combination doesn't exist at all in Shopify, we disable it completely.
          // If it exists but is OOS, we show it crossed out.

          return (
            <button
              key={value}
              onClick={() => {
                if (isExists) {
                  router.replace(optionUrl, { scroll: false });
                }
              }}
              disabled={!isExists}
              title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className={cn(
                'relative min-w-12 px-4 py-2 text-sm rounded-full border transition-all duration-200 overflow-hidden',
                // Active State
                isActive
                  ? 'bg-[#3E2723] text-white border-[#3E2723] ring-1 ring-[#3E2723]'
                  : 'bg-transparent text-[#5D4037] border-[#b88d6a]/40 hover:border-[#3E2723]',
                // Out of Stock State (Diagonal Line)
                !isAvailableForSale &&
                  isExists &&
                  'text-opacity-40 cursor-not-allowed bg-neutral-50 decoration-neutral-500 after:absolute after:top-1/2 after:left-0 after:w-full after:h-px after:bg-[#5D4037]/40 after:-translate-y-1/2 after:-rotate-12 after:content-[""]',
                // Non-existent State
                !isExists && 'opacity-20 cursor-not-allowed border-dashed'
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  ));
}
