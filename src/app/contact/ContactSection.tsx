'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Image as ShopifyImage } from '@/lib/shopify/types';
import { ShopifyRichText } from '@/components/shared/ShopifyRichText';
import { FadeIn } from '@/components/shared/FadeIn';

gsap.registerPlugin(useGSAP);

interface ContactSectionProps {
  image?: ShopifyImage;
  title: string;
  subtitle?: string;
  body: string;
}

export function ContactSection({
  image,
  title,
  subtitle,
  body,
}: ContactSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.1 },
          {
            scale: 1,
            duration: 2.5,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-200 w-full overflow-hidden bg-[#1a1a1a]"
    >
      {/* --- Background Image --- */}
      <div className="absolute inset-0 w-full h-full">
        <FadeIn
          vars={{ scale: 1, opacity: 0.7 }}
          className="absolute inset-0 opacity-0 motion-safe:scale-125"
        >
          <Image
            ref={imageRef}
            src={image?.url || '/contact/contact-bg.jpg'}
            alt="Collection Waliliya - Élégance et Modestie"
            fill
            priority
            className="object-fill motion-reduce:opacity-50"
          />
          {/* Soft Overlay to ensure text readability (Beige/Warm tint) */}
          <div className="absolute inset-0 bg-[#3E2723]/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-t from-[#F5F5F0]/20 via-transparent to-transparent" />
        </FadeIn>
      </div>

      {/* --- Centered Content --- */}
      <div className="relative z-10 flex h-full flex-col justify-center items-center px-6 max-w-4xl mx-auto ">
        {/* Subtitle (Quote) */}
        {subtitle && (
          <FadeIn vars={{ y: 20 }}>
            <span className="font-subtitle text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#F5F5F0]/80 mb-6  border-b border-[#F5F5F0]/30 pb-4 inline-block">
              {subtitle}
            </span>
          </FadeIn>
        )}

        {/* Main Title */}
        <FadeIn vars={{ y: 20, delay: 0.2 }}>
          <h1 className="font-title text-5xl md:text-7xl lg:text-8xl mb-10 leading-tight text-[#b88d6a]">
            {title}
          </h1>
        </FadeIn>

        {/* Rich Text Body (Email, Hours, etc.) */}
        <FadeIn vars={{ y: 20, delay: 0.4 }}>
          <div className="backdrop-blur-sm bg-white/10 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <ShopifyRichText
              data={body}
              className="
               text-lg font-text leading-relaxed   [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 hover:[&_a]:text-[#b88d6a] transition-colors"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
