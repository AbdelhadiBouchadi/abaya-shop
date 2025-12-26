import { getCollections } from '@/lib/shopify';
import { Suspense } from 'react';
import FilterList from './Filter';

async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded bg-[#e8e0d9]';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="hidden md:block py-4">
          <div className="mb-4 h-4 w-20 animate-pulse rounded bg-[#dcd0c6]" />{' '}
          {/* Title  */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className={skeleton} />
          ))}
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
