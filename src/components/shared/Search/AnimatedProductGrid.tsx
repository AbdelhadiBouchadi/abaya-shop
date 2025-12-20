'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Product } from '@/lib/shopify/types';
import Grid from './Grid';
import { ProductCard } from './ProductCard';

export function AnimatedProductGrid({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.grid-item', {
          y: 50,
          opacity: 0,
        });

        gsap.to('.grid-item', {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',

          clearProps: 'transform',
        });
      });

      // 2. REDUCED MOTION
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.grid-item', {
          y: 0,
          opacity: 0,
        });

        gsap.to('.grid-item', {
          opacity: 1,
          duration: 0.8,
          stagger: 0,
          ease: 'power2.inOut',
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <Grid className="grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
        {products.map((product, index) => (
          <Grid.Item key={product.handle} className="grid-item opacity-0">
            <ProductCard product={product} priority={index < 4} />
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
}
