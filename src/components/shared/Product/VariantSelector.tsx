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

  if (!options.length) return null;

  const checkAvailability = (targetOptions: Record<string, string>) => {
    const matchingVariant = variants.find((variant) =>
      variant.selectedOptions.every((vOption) => {
        const targetValue = targetOptions[vOption.name.toLowerCase()];
        return targetValue === vOption.value;
      })
    );
    return {
      exists: !!matchingVariant,
      available: matchingVariant?.availableForSale ?? false,
      metafield: matchingVariant?.metafield,
    };
  };

  return options.map((option) => {
    const isColor = ['color', 'couleur', 'colour'].includes(
      option.name.toLowerCase()
    );

    return (
      <div key={option.id} className="mb-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#3E2723]">
          {option.name}
        </h3>

        <div className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            const targetParams = new URLSearchParams(searchParams.toString());
            targetParams.set(optionNameLowerCase, value);

            const checkMap: Record<string, string> = {};
            options.forEach((opt) => {
              const key = opt.name.toLowerCase();
              if (key === optionNameLowerCase) {
                checkMap[key] = value;
              } else {
                checkMap[key] = targetParams.get(key) || opt.values[0];
              }
            });

            const status = checkAvailability(checkMap);
            const isActive = searchParams.get(optionNameLowerCase) === value;

            const clickUrl = createUrl(pathname, targetParams);

            const colorVariant = variants.find((v) =>
              v.selectedOptions.some(
                (o) =>
                  o.name.toLowerCase() === optionNameLowerCase &&
                  o.value === value
              )
            );
            const colorHex = isColor
              ? colorVariant?.metafield?.value || value
              : null;

            return (
              <button
                key={value}
                onClick={() => {
                  if (status.exists) {
                    router.replace(clickUrl, { scroll: false });
                  }
                }}
                disabled={!status.exists}
                title={`${option.name} ${value}${!status.available ? ' (Out of Stock)' : ''}`}
                className={cn(
                  'group relative flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all duration-300 shadow-sm overflow-hidden',

                  isActive
                    ? 'bg-[#3E2723] text-white border-[#3E2723] ring-1 ring-[#3E2723]'
                    : 'bg-white text-[#5D4037] border-[#b88d6a]/30 hover:border-[#3E2723]',

                  !status.available &&
                    status.exists &&
                    'text-opacity-50 cursor-not-allowed bg-neutral-50 decoration-neutral-500 after:absolute after:top-1/2 after:left-0 after:w-full after:h-px after:bg-[#5D4037]/40 after:-translate-y-1/2 after:-rotate-12 after:content-[""]',

                  !status.exists &&
                    'opacity-20 cursor-not-allowed border-dashed'
                )}
              >
                {isColor && (
                  <span
                    className={cn(
                      'block w-4 h-4 rounded-full border border-black/10 shadow-inner',
                      isActive && 'ring-1 ring-white'
                    )}
                    style={{ backgroundColor: colorHex || '#ccc' }}
                  />
                )}

                <span className="font-medium">{value}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  });
}
