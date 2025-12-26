'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ShopifyRichText } from '@/components/shared/ShopifyRichText';
import { FadeIn } from '@/components/shared/FadeIn';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type FAQData = Record<
  string,
  { question: string; answer: string; category: string }[]
>;

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// --- Single Accordion Item ---
function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[#b88d6a]/20 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left group"
      >
        <span className="font-text text-lg font-medium text-[#3E2723] group-hover:text-[#9d5035] transition-colors">
          {question}
        </span>
        <span className="ml-4 text-[#9d5035] shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </span>
      </button>
      <div ref={contentRef} className="h-0 overflow-hidden">
        <div className="pb-6 pr-8 text-[#5D4037]/80 leading-relaxed font-text">
          <ShopifyRichText data={answer} />
        </div>
      </div>
    </div>
  );
}

// --- Main Layout ---
export default function FAQClient({ data }: { data: FAQData }) {
  const categories = Object.keys(data);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Handle Scroll Spy (Update active link on scroll)
  useEffect(() => {
    const ctx = gsap.context(() => {
      categories.forEach((cat) => {
        const selector = `#cat-${slugify(cat)}`;

        ScrollTrigger.create({
          trigger: selector,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveCategory(cat),
          onEnterBack: () => setActiveCategory(cat),
        });
      });
    });
    return () => ctx.revert();
  }, [categories]);

  // Handle Click to Scroll
  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const selector = `#cat-${slugify(cat)}`;

    gsap.to(window, {
      duration: 1,
      scrollTo: { y: selector, offsetY: 100 },
      ease: 'power3.out',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
      {/* --- LEFT: Sticky Navigation --- */}
      <div className="hidden lg:block w-1/4 sticky top-32">
        <div className="space-y-1 border-l-2 border-[#F5F5F0]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={cn(
                'block w-full text-left pl-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-l-2 -ml-0.5',
                activeCategory === cat
                  ? 'border-[#9d5035] text-[#9d5035]'
                  : 'border-transparent text-[#5D4037]/50 hover:text-[#5D4037]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- RIGHT: Content Sections --- */}
      <div className="w-full lg:w-3/4 space-y-20">
        {categories.map((cat, i) => (
          <section
            key={cat}
            id={`cat-${slugify(cat)}`}
            className="scroll-mt-32"
          >
            <FadeIn vars={{ y: 20, delay: i * 0.1 }}>
              <div className="mb-8 flex items-baseline gap-4">
                <h2 className="font-title text-4xl text-[#3E2723]">{cat}</h2>
                <div className="h-px flex-1 bg-[#b88d6a]/20" />
              </div>

              <div className=" rounded-2xl p-8 shadow-sm border border-[#F5F5F0]">
                {data[cat].map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </FadeIn>
          </section>
        ))}
      </div>
    </div>
  );
}
