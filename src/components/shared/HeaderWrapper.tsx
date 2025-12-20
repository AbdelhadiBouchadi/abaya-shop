'use client';

import type React from 'react';

import { useEffect, useState } from 'react';

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      {children}
    </div>
  );
}
