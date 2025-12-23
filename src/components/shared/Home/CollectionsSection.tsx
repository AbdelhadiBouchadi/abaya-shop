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

// --- 1. PORTRAIT CARD (For the top 3 items) ---
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
          { y: '-10%', scale: 1.1 }, // Start slightly zoomed and pulled up
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
    <Link href={collection.path} className="group block w-full">
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
        <div className="absolute bottom-4 left-4 z-10 text-white">
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

// --- 2. LANDSCAPE CARD (For the bottom item) ---
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
            y: '0%', // Less movement for landscape to avoid showing edges
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
    <Link
      href={collection.path}
      className="group block w-full col-span-1 lg:col-span-3"
    >
      <div
        ref={containerRef}
        className="relative aspect-video lg:aspect-21/9 w-full overflow-hidden rounded-xl bg-[#f4f1ed]"
      >
        {collection.image ? (
          <Image
            ref={imageRef}
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            className="h-[120%] w-full object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#5D4037]/40">
            No Image
          </div>
        )}

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30">
          <FadeIn vars={{ y: 20 }}>
            <h3 className="font-title text-4xl text-white md:text-6xl lg:text-7xl drop-shadow-lg text-center">
              {collection.title}
            </h3>
          </FadeIn>
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
  // 1. DEFINE YOUR MASTER ORDER HERE
  // The exact handles from Shopify in the order you want them displayed.
  const masterOrder = [
    'abayas', // 1st (Top Left)
    'abayas-luxe-dubai', // 2nd (Top Middle)
    'abaya-essentielle', // 3rd (Top Right)
    'summer', // 4th (Bottom Landscape)
    'bien-etre', // 5th (Not shown in 3+1 grid, or added later)
  ];

  // 2. SORT THE COLLECTIONS
  const sortedCollections = [...collections].sort((a, b) => {
    const indexA = masterOrder.indexOf(a.handle);
    const indexB = masterOrder.indexOf(b.handle);

    // If neither in list, keep original order
    if (indexA === -1 && indexB === -1) return 0;
    // If A not in list, move to end
    if (indexA === -1) return 1;
    // If B not in list, move to end
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // 3. SLICE FOR LAYOUT
  // Top 3 Vertical Cards
  const displayTop = sortedCollections.slice(0, 3);

  // The 4th item becomes the Landscape Card
  const bottomCollection = sortedCollections[3];

  return (
    <Bounded className="py-20 md:py-32 max-w-none ">
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

        {/* --- THE GRID --- */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {/* Row 1: The Three Vertical Cards */}
          {displayTop.map((col, i) => (
            <div key={col.handle} className="col-span-1">
              <FadeIn vars={{ y: 30, delay: i * 0.1 }}>
                <PortraitCard collection={col} />
              </FadeIn>
            </div>
          ))}

          {/* Row 2: The Big Landscape Card */}
          {bottomCollection && (
            <FadeIn
              vars={{ y: 30, delay: 0.3 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 mt-2"
            >
              <LandscapeCard collection={bottomCollection} />
            </FadeIn>
          )}
        </div>
      </div>
    </Bounded>
  );
}
