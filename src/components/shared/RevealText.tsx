'use client';

import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, type ElementType } from 'react'; // <--- 1. Import ElementType
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealTextProps {
  text: string;
  className?: string;
  tagName?: ElementType; // <--- 2. Use ElementType instead of JSX.IntrinsicElements
  delay?: number;
}

export const RevealText = ({
  text,
  className,
  tagName: Tag = 'h1',
  delay = 0,
}: RevealTextProps) => {
  // <--- 3. Use HTMLElement to be safe for any tag (h1, div, p)
  const textRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chars = textRef.current?.querySelectorAll('.char');
      if (chars && chars.length > 0) {
        gsap.fromTo(
          chars,
          {
            y: 100,
            opacity: 0,
            rotate: 5,
          },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            stagger: 0.03,
            duration: 1.2,
            ease: 'power3.out',
            delay: delay,
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    },
    { scope: textRef }
  );

  return (
    <Tag
      ref={textRef}
      className={cn('overflow-hidden leading-tight', className)}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="block">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="char inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </span>
        ))}
      </span>
    </Tag>
  );
};
