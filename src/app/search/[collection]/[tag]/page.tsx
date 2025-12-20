import { getProducts } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultSort, sorting } from '@/lib/constants';
import { AnimatedProductGrid } from '@/components/shared/Search/AnimatedProductGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; tag: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  const cleanTag = decodeURIComponent(resolvedParams.tag).replace(/-/g, ' ');
  const title = cleanTag.replace(/\b\w/g, (l) => l.toUpperCase());
  const collectionTitle =
    resolvedParams.collection.charAt(0).toUpperCase() +
    resolvedParams.collection.slice(1);

  return {
    title: `${title} - ${collectionTitle} | Waliliya`,
    description: `Découvrez nos produits ${title} dans la collection ${collectionTitle}`,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; tag: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { sort } = resolvedSearchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const tagHandle = decodeURIComponent(resolvedParams.tag);

  const realShopifyTag = tagHandle.replace(/-/g, ' ');

  const products = await getProducts({
    query: `tag:${realShopifyTag}`,
    sortKey,
    reverse,
  });

  if (!products) return notFound();

  // Formatting for display title (Capitalize words)
  const displayTitle = realShopifyTag.replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section>
      <div className="mb-8">
        <span className="font-subtitle text-sm text-[#9d5035] uppercase tracking-widest mb-2 block">
          {resolvedParams.collection.replace(/-/g, ' ')}
        </span>
        <h1 className="font-title text-3xl text-[#3E2723] md:text-5xl tracking-tight">
          {displayTitle}
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center font-text text-[#5D4037] opacity-80">
          <p className="text-lg">
            Aucun produit trouvé pour <em>{displayTitle}</em>.
          </p>
        </div>
      ) : (
        <AnimatedProductGrid products={products} />
      )}
    </section>
  );
}
