'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { HiX, HiChevronDown, HiMenuAlt2 } from 'react-icons/hi';
import gsap from 'gsap';
import { Menu } from '@/lib/shopify/types';
import { formatMenuUrl } from '@/lib/utils';
import Search from './Search';

// --- Sub-component for individual items ---
function MenuItemTree({
  item,
  level = 0,
  closeMenu,
}: {
  item: Menu;
  level?: number;
  closeMenu: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = item.items && item.items.length > 0;
  const subMenuRef = useRef<HTMLUListElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  // Use the helper to clean the URL
  const itemUrl = formatMenuUrl(item.url);

  // Animate Submenu Height
  useEffect(() => {
    if (hasSubItems && subMenuRef.current) {
      if (isExpanded) {
        gsap.to(subMenuRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(arrowRef.current, { rotate: 180, duration: 0.3 });
      } else {
        gsap.to(subMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
        gsap.to(arrowRef.current, { rotate: 0, duration: 0.3 });
      }
    }
  }, [isExpanded, hasSubItems]);

  return (
    <li className="select-none">
      <div
        className={`flex items-center justify-between py-3 pr-2 rounded-lg transition-colors duration-200 ${
          level === 0 ? 'hover:bg-[#F5F5F0]' : ''
        }`}
        style={{ paddingLeft: level * 16 }}
      >
        <Link
          href={itemUrl}
          onClick={closeMenu}
          className={`flex-1 ${
            level === 0
              ? 'font-title text-lg font-medium text-[#3E2723]'
              : 'font-text text-base text-[#5D4037]'
          }`}
        >
          {item.title}
        </Link>

        {hasSubItems && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 text-[#b88d6a] active:scale-95 transition-transform"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <span ref={arrowRef} className="block">
              <HiChevronDown className="text-xl" />
            </span>
          </button>
        )}
      </div>

      {/* Sub-items Container */}
      {hasSubItems && (
        <ul
          ref={subMenuRef}
          className="h-0 opacity-0 overflow-hidden border-l border-[#b88d6a]/20 ml-4"
        >
          {item.items!.map((subItem) => (
            <MenuItemTree
              key={subItem.title}
              item={subItem}
              level={level + 1}
              closeMenu={closeMenu}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// --- Main MobileMenu Component ---
export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (menuRef.current && backdropRef.current) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';

        gsap.to(menuRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
        gsap.to(backdropRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        // Unlock body scroll
        document.body.style.overflow = '';

        gsap.to(menuRef.current, {
          x: '-100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in',
        });
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <div className="xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl cursor-pointer text-[#9d5035] hover:text-[#b88d6a] transition-colors p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiMenuAlt2 />}
        </button>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              ref={backdropRef}
              className="fixed inset-0 bg-black/40 z-998 backdrop-blur-sm xl:hidden opacity-0 pointer-events-none"
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Drawer */}
            <div
              ref={menuRef}
              className="fixed top-0 left-0 h-dvh w-[85vw] max-w-sm bg-white shadow-2xl z-999 
              flex flex-col opacity-0 -translate-x-full xl:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F5F5F0]/50 shrink-0">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/Logo.png"
                    alt="Waliliya logo"
                    width={80}
                    height={80}
                  />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-[#9d5035]"
                >
                  <HiX className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide overscroll-contain">
                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Recherche
                  </p>
                  <Search />
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Menu
                  </p>
                  <ul className="space-y-1">
                    {menu.map((item) => (
                      <MenuItemTree
                        key={item.title}
                        item={item}
                        closeMenu={() => setIsOpen(false)}
                      />
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-6 pb-20">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm text-gray-600 hover:text-[#9d5035]"
                  >
                    Contactez-nous
                  </Link>
                  <Link
                    href="/la-creatrice"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm text-gray-600 hover:text-[#9d5035]"
                  >
                    La créatrice
                  </Link>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
