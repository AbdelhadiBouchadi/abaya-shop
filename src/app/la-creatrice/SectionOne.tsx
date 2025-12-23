'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Image as ShopifyImage } from '@/lib/shopify/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SectionOne({
  image,
  htmlBody,
}: {
  image?: ShopifyImage;
  htmlBody: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate Image (Slide from Left)
      gsap.fromTo(
        '.anim-image',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-image', start: 'top 80%' },
        }
      );

      // Animate Text (Slide from Right)
      gsap.fromTo(
        '.anim-text',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-text', start: 'top 80%' },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 max-w-360 mx-auto px-6 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        {/* LEFT: Image */}
        <div className="w-full lg:w-1/2 anim-image opacity-0">
          {image && (
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src={image.url}
                alt={image.altText || 'La Créatrice'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* RIGHT: Main Body Text */}
        <div className="w-full lg:w-1/2 anim-text opacity-0">
          <div
            className="prose prose-lg prose-brown font-text text-[#5D4037]/80 leading-relaxed
                       prose-headings:font-title prose-headings:text-[#3E2723] prose-headings:font-normal"
            dangerouslySetInnerHTML={{ __html: htmlBody }}
          />
        </div>
      </div>
    </section>
  );
}
