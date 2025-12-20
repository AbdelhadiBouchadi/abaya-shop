'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ListItem } from './Filter';
import { ChevronDownIcon } from 'lucide-react';
import { FilterItem } from './FilterItem';

export default function FilterItemDropDown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative font-text" ref={ref}>
      <div
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#b88d6a]/30 bg-white/50 px-4 py-2 text-sm text-[#3E2723] hover:border-[#9d5035] transition-colors"
      >
        <span className="font-medium">{active || 'Select'}</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-300 ${openSelect ? 'rotate-180' : ''}`}
        />
      </div>

      {openSelect && (
        <div
          onClick={() => setOpenSelect(false)}
          className="absolute z-40 mt-2 w-full rounded-xl border border-[#b88d6a]/20 bg-white/95 backdrop-blur-xl p-2 shadow-xl"
        >
          <ul className="space-y-1">
            {list.map((item: ListItem, i) => (
              <FilterItem item={item} key={i} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
