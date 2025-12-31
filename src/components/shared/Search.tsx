'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
      router.push(`/search?${newParams.toString()}`);
    } else {
      newParams.delete('q');
    }
  }

  // Animation Logic
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isExpanded) {
        gsap.to(containerRef.current, {
          width: 'auto',
          paddingRight: 16,
          duration: 0.4,
          ease: 'power2.out',
        });
        gsap.to(inputRef.current, {
          width: 200,
          opacity: 1,
          paddingLeft: 12,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(containerRef.current, {
          width: 'auto',
          paddingRight: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        });
        gsap.to(inputRef.current, {
          width: 0,
          opacity: 0,
          paddingLeft: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isExpanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !inputRef.current?.value // Keep open if there is text
      ) {
        setIsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form
      ref={containerRef}
      onSubmit={onSubmit}
      className={cn(
        'flex items-center bg-transparent border border-transparent rounded-full overflow-hidden transition-colors duration-300',
        isExpanded ? 'bg-background/50' : 'bg-transparent'
      )}
      style={{
        borderColor: isExpanded ? '#e5e7eb' : 'transparent',
        boxShadow: isExpanded ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (isExpanded && inputRef.current?.value) {
            containerRef.current?.requestSubmit();
          } else {
            setIsExpanded(!isExpanded);
            if (!isExpanded) setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="p-2 text-[#b88d6a] hover:text-[#9d5035]  cursor-pointer shrink-0 z-10 transition-all duration-300 
          ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] 
          hover:scale-110 hover:shadow-lg"
        aria-label="Search"
      >
        <HiSearch className="h-6 w-6" />
      </button>

      <input
        ref={inputRef}
        type="text"
        name="search"
        defaultValue={searchParams?.get('q') || ''}
        placeholder="Search..."
        className="bg-transparent outline-none text-sm text-gray-700 h-full w-0 opacity-0"
        autoComplete="off"
      />

      {/* Optional clear button inside expanded view */}
      {isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 pr-1"
        >
          <HiX className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
