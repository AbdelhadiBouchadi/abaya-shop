'use client';

import { FadeIn } from '@/components/shared/FadeIn';
import { ShopifyRichText } from '@/components/shared/ShopifyRichText';
import { Link } from 'next-view-transitions';

export function BottomQuote({ richText }: { richText: string }) {
  if (!richText) return null;

  return (
    <section className="w-full bg-[#1a1a1a] py-24 md:py-32 text-[#F5F5F0] mt-12">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          {/* The Rich Text Quote */}
          <div className="font-title text-2xl md:text-4xl leading-relaxed [&_p]:text-[#F5F5F0]">
            <ShopifyRichText data={richText} className="justify-center" />
          </div>

          <div className="w-16 h-px bg-[#b88d6a]/50 mx-auto" />

          <Link href="/search">
            <button className="text-[#b88d6a] hover:text-[#e0bba1] uppercase tracking-[0.2em] text-sm font-bold transition-colors cursor-pointer">
              Découvrir la boutique
            </button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
