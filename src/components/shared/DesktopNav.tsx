'use client';

import { useEffect, useRef } from 'react';
import { NavbarItem } from '../../../data';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function DesktopNav() {
  const pathname = usePathname();

  const indicatorRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeLink = document.querySelector(
      `a[data-active="true"]`
    ) as HTMLElement;
    const container = navContainerRef.current;

    if (activeLink && container && indicatorRef.current) {
      const linkBox = activeLink.getBoundingClientRect();
      const containerBox = container.getBoundingClientRect();
      const offset = linkBox.left - containerBox.left;

      gsap.to(indicatorRef.current, {
        x: offset,
        width: linkBox.width,
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      // 🔥 fallback: ซ่อนไว้ถ้าไม่มี active link
      gsap.to(indicatorRef.current, {
        width: 0,
        duration: 0.2,
      });
    }
  }, [pathname]);

  return (
    <nav className="hidden xl:flex items-center text-base">
      <div
        ref={navContainerRef}
        className="relative bg-white font-medium rounded-full flex items-center gap-2 px-1 py-1"
      >
        <div
          ref={indicatorRef}
          className="absolute top-0 left-0 h-full bg-gray-900 rounded-full z-0"
          style={{ width: 0 }}
        />
        {NavbarItem.map((nav) => {
          const isActive = pathname === nav.path;
          return (
            <Link
              key={nav.path}
              href={nav.path}
              data-active={isActive ? 'true' : 'false'}
              className="relative px-6 py-2 flex items-center justify-center rounded-full text-sm font-medium z-10 text-black"
            >
              <span className={isActive ? 'text-white' : 'text-black'}>
                {nav.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
