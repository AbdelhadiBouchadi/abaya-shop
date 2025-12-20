import { AnimatedProductGrid } from '@/components/shared/Search/AnimatedProductGrid';
import { defaultSort, sorting } from '@/lib/constants';
import { getProducts } from '@/lib/shopify';

export const metadata = {
  title: 'Waliliya | Recherche de produits',
  description: 'Rechercher des produits dans la boutique.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { sort, q: searchValue } = params as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'résultats' : 'résultat';

  return (
    <>
      {searchValue ? (
        <div className="mb-8 font-text">
          <p className="text-[#3E2723]">
            {products.length === 0
              ? 'Aucun produit ne correspond à'
              : `Affichage de ${products.length} ${resultsText} pour `}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        </div>
      ) : null}

      {products.length === 0 ? (
        <p className="py-24 text-center font-text text-[#5D4037]">
          Aucun produit trouvé dans cette collection.
        </p>
      ) : (
        <AnimatedProductGrid products={products} />
      )}
    </>
  );
}
