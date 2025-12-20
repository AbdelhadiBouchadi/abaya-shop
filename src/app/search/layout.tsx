import Collections from '@/components/shared/Search/Collections';
import FilterList from '@/components/shared/Search/Filter';
import SearchLayoutWrapper from '@/components/shared/Search/SearchLayoutWrapper';
import { sorting } from '@/lib/constants';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchLayoutWrapper
      sidebar={
        <>
          {/* Section 1: Collections */}
          <div>
            <Collections />
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-full h-px bg-[#b88d6a]/20 my-6" />

          {/* Section 2: Sort/Filter */}
          <div>
            <FilterList list={sorting} title="Trier par" />
          </div>
        </>
      }
    >
      {children}
    </SearchLayoutWrapper>
  );
}
