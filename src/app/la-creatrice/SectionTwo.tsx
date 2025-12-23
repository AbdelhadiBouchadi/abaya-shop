'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Image as ShopifyImage } from '@/lib/shopify/types';
import { ShopifyRichText } from '@/components/shared/ShopifyRichText';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SectionTwo({
  image,
  richTextJson,
}: {
  image?: ShopifyImage;
  richTextJson: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate Text (Slide from Left)
      gsap.fromTo(
        '.anim-text-2',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-text-2', start: 'top 80%' },
        }
      );

      // Animate Image (Slide from Right)
      gsap.fromTo(
        '.anim-image-2',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-image-2', start: 'top 80%' },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-360 mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* LEFT: Rich Text Content */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 anim-text-2 opacity-0">
            <ShopifyRichText data={richTextJson} className="text-lg" />
            <div className="mt-8">
              <span className="font-title text-3xl text-[#9d5035] italic">
                Waliliya
              </span>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 anim-image-2 opacity-0">
            {image && (
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md bg-[#f4f1ed]">
                <Image
                  src={image.url}
                  alt={image.altText || 'Atelier'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
