'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from '@/lib/shopify/types';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DesktopNav({ menu }: { menu: Menu[] }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="hidden xl:flex items-center gap-8 text-sm h-full">
      {menu.map((item: Menu) => {
        const hasSubMenu = item.items && item.items.length > 0;

        return (
          <div
            key={item.title}
            className="group static h-full flex items-center"
            onMouseEnter={() => setHoveredItem(item.title)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.url}
              className="flex items-center gap-1 text-[#b88d6a] hover:text-[#9d5035] transition-colors font-medium uppercase tracking-wide py-4 relative z-10 font-text"
            >
              {item.title}
              {hasSubMenu && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-300',
                    hoveredItem === item.title ? '-rotate-180' : 'rotate-0'
                  )}
                />
              )}
            </Link>

            {/* Full Width Dropdown */}
            {hasSubMenu && (
              <div
                className={cn(
                  'absolute top-full left-0 w-full pt-2 transition-all duration-300 ease-in-out z-0',
                  hoveredItem === item.title
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                )}
              >
                {/* Dropdown Content */}
                {/* UPDATED: Border uses greenish tint */}
                <div className="bg-background/90 backdrop-blur-xl border border-[#737b4c]/20 w-full py-8 rounded-2xl shadow-xl">
                  <div className="mx-auto max-w-7xl px-8 flex justify-center font-text">
                    <div className="grid grid-cols-4 gap-12 text-center">
                      {(item.items || []).map((subItem) => (
                        <div key={subItem.title} className="space-y-3">
                          <Link
                            href={subItem.url}
                            className="block text-base font-semibold text-[#b88d6a] hover:text-[#9d5035] transition-colors mb-2"
                          >
                            {subItem.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
