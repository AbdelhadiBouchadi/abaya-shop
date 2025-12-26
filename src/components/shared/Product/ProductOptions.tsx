'use client';

import { Product } from '@/lib/shopify/types';
import { cn, checkInStock } from '@/lib/utils';

interface ProductOptionsProps {
  product: Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export function ProductOptions({
  product,
  selectedOptions,
  setSelectedOptions,
}: ProductOptionsProps) {
  const isDefaultVariant =
    product.options.length === 1 &&
    (product.options[0].name === 'Title' ||
      product.options[0].values[0] === 'Default Title');

  if (!product.options.length || isDefaultVariant) return null;

  return (
    <div className="space-y-6">
      {product.options.map((option) => {
        const isColor = ['color', 'couleur', 'colour'].includes(
          option.name.toLowerCase()
        );

        return (
          <div key={option.id}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#3E2723]">
              {option.name}
            </h3>
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const optionKey = option.name.toLowerCase();
                const isActive = selectedOptions[optionKey] === value;

                const hypotheticalState = {
                  ...selectedOptions,
                  [optionKey]: value,
                };
                const isAvailable = checkInStock(product, hypotheticalState);

                const representativeVariant = product.variants.find((v) =>
                  v.selectedOptions.some(
                    (o) =>
                      o.name.toLowerCase() === optionKey && o.value === value
                  )
                );
                const colorHex = isColor
                  ? representativeVariant?.metafield?.value || value
                  : null;

                return (
                  <button
                    key={value}
                    onClick={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [optionKey]: value,
                      }))
                    }
                    disabled={!isAvailable}
                    title={`${value}${!isAvailable ? ' (épuisé)' : ''}`}
                    className={cn(
                      'relative flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all duration-200 shadow-sm overflow-hidden',
                      isActive
                        ? 'bg-[#3E2723] text-white border-[#3E2723] ring-1 ring-[#3E2723]'
                        : 'bg-white text-[#5D4037] border-[#b88d6a]/30 hover:border-[#3E2723]',
                      !isAvailable &&
                        'text-opacity-50 decoration-neutral-500 after:absolute after:w-full after:h-px after:bg-[#5D4037]/40 after:-rotate-12 after:content-[""] select-none cursor-not-allowed opacity-50'
                    )}
                  >
                    {isColor && (
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border border-black/10 shadow-inner',
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
      })}
    </div>
  );
}
