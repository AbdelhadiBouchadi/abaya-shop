'use client';

import { Link } from 'next-view-transitions';
import { FaArrowRight } from 'react-icons/fa';

interface AtmosphereSectionProps {
  videoId?: string;
}

export default function AtmosphereSection({
  videoId = '7s2K5g-g-l0',
}: AtmosphereSectionProps) {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center mt-16">
      {/* 1. Background Video Wrapper (Pointer events none allows scroll over it) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* The iframe is scaled up to 150% to hide YouTube branding/controls/black bars */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-90"
        />
      </div>

      {/* 2. Earthy Overlay to dampen video brightness and tint it brown */}
      <div className="absolute inset-0 bg-[#3E2723]/40 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* 3. Glassmorphic Content Card */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto text-center">
        <div
          className="
            backdrop-blur-xl bg-[#fbf7f3]/10 border border-[#fbf7f3]/20 
            shadow-2xl rounded-2xl p-8 md:p-16
            flex flex-col items-center gap-6
            animate-fade-in-up
        "
        >
          <span className="text-[#fbf7f3] text-xs md:text-sm font-bold tracking-[0.2em] uppercase opacity-90">
            L&apos;Élégance au Naturel
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-title text-white leading-tight">
            Redéfinir la <span className="italic text-[#d4b096]">Modestie</span>{' '}
            <br />
            avec Modernité
          </h2>

          <p className="text-[#fbf7f3]/90 text-sm md:text-lg max-w-lg font-text font-light leading-relaxed">
            Des produits insprés par la douceur des matières et la force des
            valeurs. Découvrez une mode qui vous ressemble, sans compromis.
          </p>

          <Link
            href="/search"
            className="mt-4 group flex items-center gap-3 bg-[#d4b096] text-[#3E2723] px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:bg-[#3E2723] hover:text-white hover:scale-105 shadow-lg"
          >
            Nos Produits
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
