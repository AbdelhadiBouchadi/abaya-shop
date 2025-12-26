import { notFound } from 'next/navigation';
import { getPage } from '@/lib/shopify';
import { ShopifyRichText } from '@/components/shared/ShopifyRichText';
import { Bounded } from '@/components/shared/Bounded';
import { FadeIn } from '@/components/shared/FadeIn';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  const page = await getPage(resolvedParams.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: 'article',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const resolvedParams = await params;
  const page = await getPage(resolvedParams.page);

  if (!page) {
    return notFound();
  }

  const date = new Date(page.updatedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Bounded>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <FadeIn className="text-center mb-16 space-y-6">
            <h1 className="font-title text-4xl md:text-6xl text-[#3E2723]">
              {page.title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#b88d6a]/40" />
              <p className="text-xs font-bold tracking-widest text-[#9d5035] uppercase">
                Mise à jour le {date}
              </p>
              <div className="h-px w-12 bg-[#b88d6a]/40" />
            </div>
          </FadeIn>

          {/* Content Section */}
          <FadeIn vars={{ delay: 0.2 }}>
            <div className=" border border-[#F5F5F0] rounded-2xl p-8 md:p-12 shadow-sm backdrop-blur-sm">
              <div
                className="prose prose-brown max-w-none font-text text-[#5D4037]/80 leading-relaxed
                prose-headings:font-title prose-headings:text-[#3E2723] prose-headings:font-medium
                prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:mb-6 prose-li:marker:text-[#9d5035]
                prose-a:text-[#9d5035] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#3E2723] prose-strong:font-bold"
              >
                <ShopifyRichText data={page.body} />
              </div>
            </div>
          </FadeIn>
        </div>
      </Bounded>
    </div>
  );
}
