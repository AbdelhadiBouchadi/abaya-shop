'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { Image as ShopifyImage } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function ProductMedia({ images }: { images: ShopifyImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // --- Navigation Logic ---
  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  if (!images.length) return null;

  return (
    <div className="space-y-4 select-none">
      {/* --- MAIN CAROUSEL VIEW --- */}
      <div
        className="relative aspect-3/4 w-full max-h-[75vh] overflow-hidden rounded-xl bg-[#f4f1ed] shadow-sm group mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Container */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
        >
          {images.map((image, i) => (
            <div key={image.url} className="relative h-full w-full shrink-0">
              <Image
                src={image.url}
                alt={image.altText || 'Product Image'}
                fill
                priority={i === 0}
                className="object-contain"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>

        {/* Floating Controls (Desktop Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#3E2723] opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-white active:scale-95 disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#3E2723] opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-white active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-[#3E2723] opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
        >
          <Maximize2 size={18} />
        </button>

        {/* Mobile Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:hidden">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all',
                i === selectedIndex ? 'bg-[#3E2723] w-3' : 'bg-[#3E2723]/30'
              )}
            />
          ))}
        </div>
      </div>

      {/* --- THUMBNAILS --- */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto px-1">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-3/4 overflow-hidden rounded-lg bg-[#f4f1ed] transition-all duration-300',
                selectedIndex === index
                  ? 'ring-2 ring-[#3E2723] opacity-100 scale-95'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              )}
            >
              <Image
                src={image.url}
                alt={'Thumbnail'}
                fill
                className="object-cover"
                sizes="15vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* --- FULLSCREEN MODAL --- */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        startIndex={selectedIndex}
      />
    </div>
  );
}

function ProductModal({
  isOpen,
  onClose,
  images,
  startIndex,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: ShopifyImage[];
  startIndex: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Sync internal modal index with prop when opening
  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useGSAP(() => {
    if (!modalRef.current || !contentRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(modalRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(modalRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(contentRef.current, { scale: 0.95, opacity: 0, duration: 0.2 });
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={modalRef}
      className={cn(
        'fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md opacity-0 pointer-events-none',
        isOpen ? 'pointer-events-auto' : ''
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={32} />
      </button>

      <div
        ref={contentRef}
        className="relative w-full h-full max-w-7xl max-h-screen p-4 flex flex-col items-center justify-center"
      >
        <div className="relative w-full h-[85vh] flex items-center justify-center">
          <Image
            src={images[index]?.url as string}
            alt="Fullscreen view"
            fill
            className="object-contain"
            quality={100}
            priority
          />
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 font-mono text-sm tracking-widest">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>,
    document.body
  );
}
