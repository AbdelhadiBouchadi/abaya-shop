'use client';

import { Product } from '@/lib/shopify/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Truck, ShieldCheck } from 'lucide-react';
import { AddToCart } from '../Cart/AddToCart';
import { ProductVariantSelector } from './VariantSelector';

export function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-8 font-text">
      {/* Header */}
      <div className="space-y-2 border-b border-[#b88d6a]/20 pb-6">
        <h1 className="font-title text-4xl md:text-5xl text-[#3E2723] leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-xl md:text-2xl font-medium text-[#5D4037]">
            {new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: product.priceRange.maxVariantPrice.currencyCode,
            }).format(parseFloat(product.priceRange.maxVariantPrice.amount))}
          </p>
          {/* Example Badge */}
          {parseFloat(product.priceRange.maxVariantPrice.amount) > 199 && (
            <span className="bg-[#f0eae5] text-[#3E2723] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Premium
            </span>
          )}
        </div>
      </div>

      <ProductVariantSelector
        options={product.options}
        variants={product.variants}
      />

      {/* Description (Short) */}
      {product.descriptionHtml && (
        <div
          className="prose prose-sm text-[#5D4037]/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      )}

      {/* Add To Cart */}
      <div className="pt-4">
        <AddToCart product={product} />
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-2 gap-4 text-xs text-[#5D4037]/70 py-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" /> <span>Livraison rapide</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> <span>Paiement sécurisé</span>
        </div>
      </div>

      {/* Accordions for Details */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="details" className="border-[#b88d6a]/20">
          <AccordionTrigger className="font-title text-[#3E2723] hover:text-[#9d5035]">
            Détails & Composition
          </AccordionTrigger>
          <AccordionContent className="text-[#5D4037]/80">
            Tissu Nidha de haute qualité, fluide et léger. Idéal pour toutes les
            saisons. Lavage à main recommandé ou cycle délicat 30°C.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping" className="border-[#b88d6a]/20">
          <AccordionTrigger className="font-title text-[#3E2723] hover:text-[#9d5035]">
            Livraison & Retours
          </AccordionTrigger>
          <AccordionContent className="text-[#5D4037]/80">
            Expédition sous 24/48h. Retours acceptés sous 14 jours si le produit
            n&apos;a pas été porté.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
