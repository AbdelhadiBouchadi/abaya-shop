'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Collection } from '@/lib/shopify/types';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FadeIn } from '../FadeIn';
import { Bounded } from '../Bounded';
import { RevealText } from '../RevealText';
import { Link } from 'next-view-transitions';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- Sub-Component: The Individual Collection Card ---
const CollectionCard = ({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isEven = index % 2 === 0;

  useGSAP(
    () => {
      // Parallax Effect for the image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: '-10%' },
          {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative flex w-full flex-col gap-8 md:flex-row md:items-center md:gap-16 lg:gap-24',
        !isEven && 'md:flex-row-reverse' // Alternating Layout
      )}
    >
      {/* Image Side */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl md:w-1/2 lg:aspect-3/4">
        {collection.image ? (
          <Image
            ref={imageRef}
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            className="h-[120%] w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#DCDBDB]">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Pistachio Overlay on Hover */}
        <div className="absolute inset-0 bg-[#7D915B]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-multiply" />
      </div>

      {/* Text Side */}
      <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
        <FadeIn vars={{ y: 20 }}>
          <h3 className="font-title text-4xl text-[#3E2723] md:text-5xl lg:text-6xl">
            {collection.title}
          </h3>
        </FadeIn>

        <FadeIn vars={{ delay: 0.2 }}>
          <div
            dangerouslySetInnerHTML={{
              __html:
                collection.description ||
                'Découvrez notre sélection exclusive.',
            }}
            className="mt-6 max-w-md font-text text-lg leading-relaxed text-[#5D4037]/80 prose"
          />
        </FadeIn>

        <FadeIn vars={{ delay: 0.4 }} className="mt-8">
          <Link href={collection.path}>
            <button className="relative overflow-hidden rounded-2xl cursor-pointer border border-[#3E2723] px-8 py-3 text-[#3E2723] transition-all duration-300 hover:border-[#7D915B] hover:text-[#7D915B]">
              <span className="font-subtitle text-sm font-bold uppercase tracking-widest">
                Explorer la collection
              </span>
            </button>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function CollectionsProducts({
  collections,
}: {
  collections: Collection[];
}) {
  return (
    <Bounded className="bg-white py-20 md:py-32">
      <div className="relative mx-auto space-y-16 md:space-y-24">
        {/* Section Header */}
        <div className="space-y-6 text-center">
          <FadeIn>
            <p className="font-subtitle text-xs font-bold tracking-[0.2em] uppercase text-[#7D915B]">
              Nos Collections
            </p>
          </FadeIn>

          <div className="flex justify-center">
            <RevealText
              text="Collections Signatures"
              tagName="h2"
              className="font-title text-5xl text-[#3E2723] md:text-6xl lg:text-7xl"
            />
          </div>

          <FadeIn className="mx-auto max-w-2xl">
            <p className="font-text text-lg text-[#5D4037]/70">
              Des pièces uniques pensées pour sublimer votre quotidien avec
              pudeur et raffinement.
            </p>
          </FadeIn>
        </div>

        {/* Collections Grid (Stacked) */}
        <div className="flex flex-col gap-24 md:gap-40">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.handle}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </Bounded>
  );
}
