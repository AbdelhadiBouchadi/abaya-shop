import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { TAGS } from '@/lib/constants';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update',
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update',
  ];

  const headersList = await headers();
  const topic = headersList.get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
