import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Product } from '@/lib/shopify/types';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.handle}`}
      className="group flex flex-col gap-4 w-full"
      prefetch={true}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-[#f4f1ed] shadow-sm group-hover:shadow-lg transition-all duration-500">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            priority={priority}
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
            Pas d&apos;image
          </div>
        )}

        {/* Cinematic Overlay - Darkens slightly on hover for focus */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5 pointer-events-none" />

        {/* Optional "Quick Add" Circle Button */}
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="bg-[#b88d6a] text-gray-200 rounded-full p-3 shadow-lg hover:bg-[#9d5035] hover:text-gray-200 transition-colors duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Typography & Details */}
      <div className="flex flex-col items-start space-y-1">
        {/* Title */}
        <h3 className="font-title text-[15px] md:text-[17px] font-medium text-[#3E2723] leading-snug group-hover:underline decoration-[#b88d6a] underline-offset-4 decoration-1 transition-all">
          {product.title}
        </h3>

        {/* Price */}
        <p className="font-text text-sm text-[#5D4037]/70 font-light tracking-wide">
          {new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: product.priceRange.maxVariantPrice.currencyCode,
            currencyDisplay: 'narrowSymbol',
          }).format(parseFloat(product.priceRange.maxVariantPrice.amount))}
        </p>
      </div>
    </Link>
  );
}
