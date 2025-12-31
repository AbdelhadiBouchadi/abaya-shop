'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Bounded } from '../Bounded';
import { FadeIn } from '../FadeIn';
import { RevealText } from '../RevealText';
import { Link } from 'next-view-transitions';

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.05 },
        {
          scale: 1,
          duration: 2.5,
          ease: 'power2.out',
        }
      );

      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=200',
          scrub: true,
        },
        width: '95%',
        borderBottomLeftRadius: '2rem',
        borderBottomRightRadius: '2rem',
        ease: 'power1.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-150 w-full overflow-hidden mx-auto"
    >
      {/* --- Background Image --- */}
      <FadeIn
        vars={{ scale: 1, opacity: 0.9 }}
        className="absolute inset-0 opacity-0 motion-safe:scale-125"
      >
        <Image
          ref={imageRef}
          src="/hero/hero-image.jpg"
          alt="Collection Waliliya - Élégance et Modestie"
          fill
          priority
          className="object-fill motion-reduce:opacity-50"
        />
        {/* Soft Overlay to ensure text readability (Beige/Warm tint) */}
        <div className="absolute inset-0 bg-[#3E2723]/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-[#F5F5F0]/10 via-transparent to-transparent" />
      </FadeIn>

      {/* --- Content --- */}
      <Bounded className="relative flex h-full flex-col justify-center pt-20">
        <div className="max-w-3xl">
          {/* UPDATED: Tagline is Olive Green */}
          <FadeIn vars={{ delay: 0.2 }}>
            <span className="font-subtitle text-sm md:text-base font-semibold tracking-widest uppercase text-[#9d5035] mb-4 block pl-1">
              Nouvelles Collections
            </span>
          </FadeIn>

          {/* UPDATED: Main Headline is Olive Green */}
          <div className="font-title text-[#9d5035]">
            <RevealText
              text="L'Élégance"
              className="text-5xl md:text-7xl font-medium mb-4"
              delay={0.3}
            />
            <RevealText
              text="au Naturel."
              className="text-5xl md:text-7xl font-medium italic"
              delay={0.5}
            />
          </div>

          {/* UPDATED: Subtext is Olive Green (slightly transparent) */}
          <FadeIn
            className="mt-6 max-w-lg text-lg md:text-xl text-[#9d5035]/95 font-text leading-relaxed pl-1"
            vars={{ delay: 0.8 }}
          >
            <p>
              Une collection pensée pour la femme moderne. Des matières nobles,
              des coupes fluides et une modestie qui ne fait aucun compromis sur
              le style.
            </p>
          </FadeIn>

          <FadeIn className="mt-10" vars={{ delay: 1 }}>
            <Link href="/search">
              {/* UPDATED: Button BG is Olive Green (#737b4c) */}
              <button className="group relative overflow-hidden rounded-2xl bg-[#737b4c] px-8 py-4 transition-all duration-300 hover:shadow-lg cursor-pointer">
                {/* UPDATED: Button Hover fill is Rust Brown (#9d5035) */}
                <div className="absolute inset-0 translate-y-full bg-[#d1fa9d] transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

                <span className="relative flex items-center gap-2 font-subtitle text-sm font-bold uppercase tracking-wide text-[#F5F5F0] transition-colors duration-300 group-hover:text-white">
                  Découvrir Nos collections
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M1 11L11 1M11 1H3M11 1V9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </FadeIn>
        </div>
      </Bounded>
    </section>
  );
}
