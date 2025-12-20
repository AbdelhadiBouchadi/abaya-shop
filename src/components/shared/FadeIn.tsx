'use client';

import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FadeInProps = {
  children: React.ReactNode;
  vars?: gsap.TweenVars;
  start?: string;
  className?: string;
};

export const FadeIn = ({
  children,
  start = 'top 80%',
  vars = {},
  className,
}: FadeInProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 }, // Start state
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: 'play none none reverse',
          },
          ...vars, // Overwrite with props
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={cn('opacity-0', className)}>
      {children}
    </div>
  );
};
