'use client';

import { useState } from 'react';
import { Product } from '@/lib/shopify/types';
import { ArrowDown } from 'lucide-react';
import { AnimatedProductGrid } from '../Search/AnimatedProductGrid';

export function RelatedProducts({ products }: { products: Product[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!products.length) return null;

  const visibleProducts = isExpanded ? products : products.slice(0, 3);
  const hasMore = products.length > 3;

  return (
    <div className="py-24 border-t border-[#b88d6a]/20 mt-24">
      <div className="flex flex-col items-center mb-12">
        <span className="font-subtitle text-xs font-bold tracking-[0.2em] uppercase text-[#9d5035] mb-2">
          Vous aimerez aussi
        </span>
        <h2 className="font-title text-3xl md:text-4xl text-[#3E2723]">
          Produits Similaires
        </h2>
      </div>

      <AnimatedProductGrid
        key={isExpanded ? 'all' : 'limited'}
        products={visibleProducts}
      />

      {hasMore && !isExpanded && (
        <div className="flex justify-center mt-12 animate-fade-in">
          <button
            onClick={() => setIsExpanded(true)}
            className="group flex items-center gap-3 px-8 py-3 rounded-full border border-[#3E2723]/20 text-[#3E2723] font-subtitle text-xs font-bold uppercase tracking-widest hover:bg-[#3E2723] hover:text-white hover:border-[#3E2723] transition-all duration-300 cursor-pointer"
          >
            Voir plus
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
