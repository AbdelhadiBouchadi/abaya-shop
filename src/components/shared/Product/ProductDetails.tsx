'use client';

import { useRef } from 'react';
import { Product } from '@/lib/shopify/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ProductMedia } from './ProductMedia';
import { ProductInfo } from './ProductInfo';

gsap.registerPlugin(useGSAP);

export function ProductDetails({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. STANDARD MOTION
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set initial state explicitly
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
          // FIX: Only clear transform to keep text crisp, but LEAVE opacity alone
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
          // FIX: Do not clear props here either, or just 'transform' if needed
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
        <ProductMedia images={product.images} />
      </div>

      {/* RIGHT COLUMN: Scrollable Info */}
      <div className="w-full lg:w-[40%] product-animate opacity-0">
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
