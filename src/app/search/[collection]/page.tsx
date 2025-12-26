import { getCollectionProducts } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultSort, sorting } from '@/lib/constants';
import { AnimatedProductGrid } from '@/components/shared/Search/AnimatedProductGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  const title =
    resolvedParams.collection.charAt(0).toUpperCase() +
    resolvedParams.collection.slice(1);

  return {
    title: `${title} - Waliliya`,
    description: `Découvrez notre collection ${title}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  // 1. Type them as Promises for Next.js 15+
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Await the promises before using them
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { sort } = resolvedSearchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getCollectionProducts({
    collection: resolvedParams.collection,
    sortKey,
    reverse,
  });

  if (!products) return notFound();

  const displayTitle = resolvedParams.collection.replace(/-/g, ' ');

  return (
    <section>
      {/* Cinematic Header */}
      <h1 className="mb-8 font-title text-3xl text-[#9d5035] uppercase md:text-5xl tracking-tight">
        {displayTitle}
      </h1>

      {products.length === 0 ? (
        <div className="py-24 text-center font-text text-[#9d5035] opacity-80">
          <p className="text-lg">Aucun produit trouvé dans cette collection.</p>
          <p className="text-sm mt-2">
            Essayez de sélectionner une autre catégorie.
          </p>
        </div>
      ) : (
        <AnimatedProductGrid products={products} />
      )}
    </section>
  );
}
