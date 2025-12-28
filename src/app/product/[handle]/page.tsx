import { getProduct, getProductRecommendations } from '@/lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { ProductDetails } from '@/components/shared/Product/ProductDetails';
import { RelatedProducts } from '@/components/shared/Product/RelatedProducts';
import { ProductProvider } from '@/components/shared/Product/product-context';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: `${product.seo.title || product.title} | Waliliya`,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return notFound();

  const relatedProducts = await getProductRecommendations(product.id);

  return (
    <ProductProvider>
      <div className="min-h-screen pt-24 md:pt-32 pb-20">
        <div className="mx-auto max-w-360 px-6">
          <ProductDetails product={product} />
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </ProductProvider>
  );
}
