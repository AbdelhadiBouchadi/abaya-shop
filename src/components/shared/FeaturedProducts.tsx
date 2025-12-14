'use client';

import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Product } from '@/lib/shopify/types';

export default function FeaturesProducts({
  products,
}: {
  products: Product[];
}) {
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        x: '290%',
        duration: 3.5,
        ease: 'linear',
        repeat: -1,
      });
    }
  }, []);

  return (
    <section className="py-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Progress Bar */}
        <div className="w-full lg:flex-1 h-1.5 bg-gray-300 relative rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-[-60%] h-full w-[60%] bg-linear-to-r from-gray-700 via-gray-900 to-transparent opacity-70"
          />
        </div>

        {/* Header Text + Button */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-2xl tracking-wide">
            Featured Products
          </span>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-300 text-lg font-medium text-gray-800 hover:bg-gray-400 transition">
            <FaPlus className="text-2xl" />
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-medium py-8 tracking-wide">
        “Top picks curated for you”
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 lg:grid-rows-2">
        {products.map((product, index) => {
          let spanClass = '';

          // if (index === 0) {
          //   spanClass = 'lg:col-span-2 lg:row-span-1';
          // } else if (index === 1) {
          //   spanClass = 'lg:col-span-2 lg:row-start-2 lg:row-span-1';
          // } else if (index === 2) {
          //   spanClass = 'lg:col-start-3 lg:row-span-2';
          // } else if (index === 3) {
          //   spanClass = 'lg:col-start-4 lg:row-span-2';
          // }

          const price = Number.parseFloat(
            product.priceRange.maxVariantPrice.amount
          );
          const currencyCode = product.priceRange.maxVariantPrice.currencyCode;

          const imageUrl = product.featuredImage?.url || product.images[0].url;

          const tag = product.tags[0];

          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className={`rounded-xl overflow-hidden bg-white shadow-sm ${spanClass} flex flex-col group`}
            >
              <div className="relative w-full aspect-video overflow-hidden bg-gray-300">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain w-full h-full transform transition-transform group-hover:scale-105 duration-700"
                />

                {tag && (
                  <span className="absolute top-3 right-3 bg-white text-gray-800 text-sm px-2 py-1.5 rounded-md shadow-sm uppercase">
                    {tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-xl tracking-wider truncate">
                  {product.title}
                </p>
                <p className="text-gray-600 text-xl font-medium">
                  {currencyCode === 'USD' ? '$' : currencyCode}
                  {price.toFixed(2)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
