'use client';

import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import gsap from 'gsap';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
  }

  useLayoutEffect(() => {
    // Animation
    if (searchRef.current) {
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      ref={searchRef}
      className="flex items-center bg-white rounded-full px-5 py-2 hover:shadow-md hover:scale-[1.03] transition-all duration-300 ease-in-out focus-within:shadow-lg focus-within:ring-1 focus-within:ring-[#272727]"
    >
      <FaSearch className="mr-2 text-lg" />
      <input
        type="text"
        key={searchParams?.get('q')}
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="bg-transparent outline-none text-base font-normal"
      />
    </form>
  );
}
