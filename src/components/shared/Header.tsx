'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Menu } from '@/lib/shopify/types';
import MobileMenu from './MobileMenu';
import DesktopNav from './DesktopNav';
import CartButton from './CartButton';
import { Link } from 'next-view-transitions';
import Search from './Search';

export default function Header({ menu }: { menu: Menu[] }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative">
      <nav className="fixed z-50 w-full px-2 font-title">
        <div
          className={cn(
            'relative mx-auto mt-2 container px-2 transition-all duration-300',
            isScrolled &&
              'max-w-7xl rounded-2xl border border-border bg-background/60 backdrop-blur-xl'
          )}
        >
          <div className="flex items-center justify-between gap-6 py-3 lg:py-4">
            {/* Mobile Menu Trigger - Left */}
            <div className="xl:hidden">
              <MobileMenu menu={menu} />
            </div>

            {/* Logo - Center on mobile, Left on desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0 z-10 ">
              <Link href="/">
                <Image
                  src="/Logo.png"
                  alt="Waliliya logo"
                  width={100}
                  height={100}
                  priority
                  className=""
                />
              </Link>
            </div>

            <div className="absolute inset-x-0 top-0 h-full hidden xl:flex justify-center items-center pointer-events-none">
              <div className="pointer-events-auto h-full flex items-center">
                <DesktopNav menu={menu} />
              </div>
            </div>

            {/* Search & Cart - Right */}
            <div className="ml-auto flex items-center gap-4 z-10">
              <div className="hidden lg:flex">
                <Search />
              </div>
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
