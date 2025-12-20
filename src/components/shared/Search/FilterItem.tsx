'use client';

import clsx from 'clsx';
import { createUrl } from '@/lib/utils';
import { Link } from 'next-view-transitions';
import { usePathname, useSearchParams } from 'next/navigation';
import { ListItem, type PathFilterItem } from './Filter';
import { type SortFilterItem } from '@/lib/constants';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? 'p' : Link;

  newParams.delete('q');

  return (
    <li className="mt-2 flex text-sm text-[#5D4037]">
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx(
          'w-full hover:text-[#9d5035] transition-colors underline-offset-4',
          {
            'font-bold text-[#3E2723] underline': active,
            'font-normal': !active,
          }
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('sort') === item.slug;
  const q = searchParams.get('q');
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && { sort: item.slug }),
    })
  );
  const DynamicTag = active ? 'p' : Link;

  return (
    <li className="mt-2 flex text-sm text-[#5D4037]">
      <DynamicTag
        href={href}
        className={clsx(
          'w-full hover:text-[#9d5035] transition-colors underline-offset-4',
          {
            'font-bold text-[#3E2723] underline': active,
            'font-normal': !active,
          }
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
