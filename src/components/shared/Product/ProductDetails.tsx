'use client';

import { useRef, useState } from 'react';
import { Product } from '@/lib/shopify/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ProductMedia } from './ProductMedia';
import { checkInStock, findVariant, formatCurrency } from '@/lib/utils';
import { ProductOptions } from './ProductOptions';
import { AddToCart } from '../Cart/AddToCart';
import { ShieldCheck, Truck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

gsap.registerPlugin(useGSAP);

export function ProductDetails({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const options: Record<string, string> = {};
    product.options.forEach((opt) => {
      options[opt.name.toLowerCase()] = opt.values[0];
    });
    return options;
  });

  const selectedVariant = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity = selectedVariant?.quantityAvailable ?? 0;
  const isLowStock = inStock && availableQuantity > 0 && availableQuantity < 5;

  const colorKey = Object.keys(selectedOptions).find((k) =>
    ['color', 'couleur'].includes(k)
  );
  const selectedColorValue = colorKey ? selectedOptions[colorKey] : null;

  const filteredImages = selectedColorValue
    ? product.images.filter(
        (img) => img.altText?.toLowerCase() === selectedColorValue.toLowerCase()
      )
    : [];

  const displayImages =
    filteredImages.length > 0 ? filteredImages : product.images;

  // GSAP Entrance Animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.product-animate', {
          y: 30,
          opacity: 0,
        });

        gsap.to('.product-animate', {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',

          clearProps: 'transform',
        });
      });

      // 2. REDUCED MOTION
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.product-animate', {
          opacity: 0,
        });

        gsap.to('.product-animate', {
          opacity: 1,
          duration: 0.8,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative"
    >
      {/* LEFT COLUMN: Sticky Gallery */}
      <div className="w-full lg:w-[60%] lg:sticky lg:top-32 lg:h-fit product-animate opacity-0">
        <ProductMedia images={displayImages} />
      </div>

      {/* Info Column */}
      <div className="w-full lg:w-[40%] space-y-8 product-animate opacity-0">
        {/* Title & Price */}
        <div className="space-y-2 border-b border-[#b88d6a]/20 pb-6">
          <h1 className="font-title text-4xl text-[#3E2723]">
            {product.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-medium text-[#5D4037]">
              {formatCurrency(
                selectedVariant?.price.amount ||
                  product.priceRange.maxVariantPrice.amount,
                product.priceRange.maxVariantPrice.currencyCode
              )}
            </span>
            {parseFloat(product.priceRange.maxVariantPrice.amount) > 199 && (
              <span className="bg-[#f0eae5] text-[#3E2723] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Description (Short) */}
        {product.descriptionHtml && (
          <div
            className="prose prose-sm text-[#5D4037]/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}

        {/* Options Selector */}
        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />

        {/* Stock Warning  */}
        {isLowStock && (
          <p className="text-red-500 text-sm font-medium animate-pulse">
            {availableQuantity}{' '}
            {availableQuantity > 1 ? 'Produits restants' : 'Produit restant'}
          </p>
        )}

        <div className="pt-2">
          <AddToCart
            product={product}
            selectedVariantId={selectedVariant?.id}
          />
        </div>

        {/* Value Props & Accordions */}
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
              Tissu Nidha de haute qualité, fluide et léger. Idéal pour toutes
              les saisons. Lavage à main recommandé ou cycle délicat 30°C.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping" className="border-[#b88d6a]/20">
            <AccordionTrigger className="font-title text-[#3E2723] hover:text-[#9d5035]">
              Livraison & Retours
            </AccordionTrigger>
            <AccordionContent className="text-[#5D4037]/80">
              Expédition sous 24/48h. Retours acceptés sous 14 jours si le
              produit n&apos;a pas été porté.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
