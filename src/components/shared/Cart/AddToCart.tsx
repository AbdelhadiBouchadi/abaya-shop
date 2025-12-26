'use client';

import { useActionState, useEffect } from 'react';
import { addItem } from './actions';
import { Product } from '@/lib/shopify/types';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

export function AddToCart({
  product,
  selectedVariantId,
}: {
  product: Product;
  selectedVariantId?: string;
}) {
  const { openCart } = useCart();
  const [state, formAction, isPending] = useActionState(addItem, null);

  const finalVariantId =
    selectedVariantId ||
    (product.variants.length === 1 ? product.variants[0]?.id : undefined);

  const variant = product.variants.find((v) => v.id === finalVariantId);
  const isAvailable = variant ? variant.availableForSale : false;

  useEffect(() => {
    if (state === 'success') {
      openCart();
    }
  }, [state, openCart]);

  if (!finalVariantId && product.variants.length > 1) {
    return (
      <button
        disabled
        className="w-full rounded-2xl bg-[#5D4037]/10 px-6 py-4 text-[#5D4037]/50 cursor-not-allowed font-medium uppercase tracking-wide opacity-70"
      >
        Sélectionnez une option
      </button>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="selectedVariantId" value={finalVariantId} />
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
