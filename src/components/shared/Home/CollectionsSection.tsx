'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Collection } from '@/lib/shopify/types';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'next-view-transitions';
import { FadeIn } from '../FadeIn';
import { Bounded } from '../Bounded';
import { RevealText } from '../RevealText';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PortraitCard = ({
  collection,
  priority = false,
}: {
  collection: Collection;
  priority?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: '-10%', scale: 1.1 },
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
    <Link href={collection.path} className="group block w-full h-full">
      <div
        ref={containerRef}
        className="relative aspect-3/4 w-full overflow-hidden rounded-xl"
      >
        {collection.image ? (
          <Image
            ref={imageRef}
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            priority={priority}
            className="h-[120%] w-full object-cover transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#5D4037]/40">
            No Image
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Floating Text (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 text-[#737b4c] font-semibold">
          <p className="font-subtitle text-xs font-bold uppercase tracking-widest drop-shadow-md">
            Collection
          </p>
          <h3 className="font-title text-xl drop-shadow-md md:text-2xl ">
            {collection.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const LandscapeCard = ({ collection }: { collection: Collection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: '-15%' },
          {
            y: '0%',
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
    <Link href={collection.path} className="group block w-full h-full">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-xl flex items-center justify-center "
      >
        {collection.image ? (
          <Image
            ref={imageRef}
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            className="size-full object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#5D4037]/40">
            No Image
          </div>
        )}

        {/* Overlay - Matching Portrait Style */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Floating Text (Bottom Left) - Matching Portrait Style */}
        <div className="absolute bottom-4 left-4 z-10 text-[#737b4c]">
          <p className="font-subtitle text-xs font-bold uppercase tracking-widest drop-shadow-md">
            Collection
          </p>
          <h3 className="font-title text-xl drop-shadow-md md:text-2xl">
            {collection.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

// --- MAIN COMPONENT ---
export default function CollectionsProducts({
  collections,
}: {
  collections: Collection[];
}) {
  const masterOrder = [
    'abayas', // 1 (Top Left)
    'abayas-luxe-dubai', // 2 (Top Middle)
    'abaya-essentielle', // 3 (Top Right)
    'summer', // 4 (Bottom Left Landscape)
    'bien-etre', // 5 (Bottom Right Landscape)
  ];

  // 2. SORT THE COLLECTIONS
  const sortedCollections = [...collections].sort((a, b) => {
    const indexA = masterOrder.indexOf(a.handle);
    const indexB = masterOrder.indexOf(b.handle);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // 3. SLICE FOR LAYOUT
  const topRow = sortedCollections.slice(0, 3);
  const bottomRow = sortedCollections.slice(3, 5); // Items 4 and 5

  return (
    <Bounded className="py-20 md:py-32 max-w-none">
      <div className="relative mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <FadeIn>
            <p className="font-subtitle text-xs font-bold tracking-[0.2em] uppercase text-[#7D915B]">
              Nos Collections
            </p>
          </FadeIn>
          <div className="flex justify-center">
            <RevealText
              text="Univers Waliliya"
              className="font-title text-4xl text-[#3E2723] md:text-6xl"
            />
          </div>
        </div>

        {/* --- MAIN GRID CONTAINER --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ROW 1: 3 Portrait Cards */}
          {topRow.map((col, i) => (
            <div key={col.handle} className="col-span-1">
              <FadeIn vars={{ y: 30, delay: i * 0.1 }}>
                <PortraitCard collection={col} />
              </FadeIn>
            </div>
          ))}

          <div className="col-span-1 md:col-span-3 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bottomRow.map((col, i) => (
                <FadeIn key={col.handle} vars={{ y: 30, delay: 0.3 + i * 0.1 }}>
                  <LandscapeCard collection={col} />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
}
