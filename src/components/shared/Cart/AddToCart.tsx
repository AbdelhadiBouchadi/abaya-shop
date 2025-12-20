'use client';

import { useActionState, useEffect } from 'react';
import { addItem } from './actions';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

export function AddToCart({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const { openCart } = useCart();
  const [state, formAction, isPending] = useActionState(addItem, null);

  const defaultVariantId =
    product.variants.length === 1 ? product.variants[0]?.id : undefined;
  const variant = product.variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option: { name: string; value: string }) =>
        option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const isAvailable = variant ? variant.availableForSale : true;

  useEffect(() => {
    if (state === 'success') {
      openCart();
    }
  }, [state, openCart]);

  if (!selectedVariantId && product.variants.length > 1) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-[#f4f1ed] px-6 py-4 text-[#5D4037]/50 cursor-not-allowed font-medium uppercase tracking-wide opacity-70"
      >
        Sélectionnez une option
      </button>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="selectedVariantId" value={selectedVariantId} />
      <button
        type="submit"
        disabled={isPending || !isAvailable}
        className={clsx(
          'relative w-full overflow-hidden rounded-2xl py-4 transition-all duration-300 group font-subtitle font-bold uppercase tracking-widest text-sm cursor-pointer',
          isAvailable
            ? 'bg-[#5D4037] text-white hover:bg-[#3E2723] hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            'flex items-center justify-center gap-3',
            isPending && 'opacity-0'
          )}
        >
          {isAvailable ? (
            <>
              <span>Ajouter au panier</span>
              <Plus size={18} />
            </>
          ) : (
            'Épuisé'
          )}
        </span>

        {/* Loading Spinner */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>
    </form>
  );
}
