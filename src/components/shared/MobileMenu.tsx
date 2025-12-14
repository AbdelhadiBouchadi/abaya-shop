'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HiX, HiMenuAlt2 } from 'react-icons/hi';
import gsap from 'gsap';
import Search from './Search';
import { NavbarItem } from '../../../data';

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        gsap.to(menuRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(menuRef.current, {
          opacity: 0,
          x: '-100%',
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isOpen]);

  return (
    <>
      <div className="xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl cursor-pointer"
        >
          {isOpen ? <HiX /> : <HiMenuAlt2 />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-99 backdrop-blur-sm xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={menuRef}
        className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#eeeeee] shadow-2xl z-100
          flex flex-col opacity-0 -translate-x-full xl:hidden"
      >
        {/* Header with logo */}
        <div className="flex items-center justify-center p-6 border-b border-b-neutral-500/40">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/Logo.png"
              alt="Abaya Shop logo"
              width={150}
              height={75}
            />
          </Link>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-b-neutral-500/40">
          <Search />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-6">
          <ul className="space-y-5 text-lg">
            {NavbarItem.map((nav) => (
              <li key={nav.path}>
                <Link
                  href={nav.path}
                  className="font-semibold hover:underline block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
