import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Product } from './shopify/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureStartWith(stringToCheck: string, startsWith: string) {
  return stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;
}

export function createUrl(
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
}

export function findVariant(
  product: Product,
  selectedOptions: Record<string, string>
) {
  return product.variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => selectedOptions[option.name.toLowerCase()] === option.value
    )
  );
}

export function checkInStock(
  product: Product,
  selectedOptions: Record<string, string>
) {
  const variant = findVariant(product, selectedOptions);
  return variant ? variant.availableForSale : false;
}

export function formatCurrency(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function formatMenuUrl(url: string | undefined): string {
  if (!url) return '/';

  if (url.startsWith('/')) {
    if (url.startsWith('/collections/')) {
      return url.replace('/collections/', '/search/');
    }
    return url;
  }

  try {
    const parsedObj = new URL(url);
    if (parsedObj.pathname.startsWith('/collections/')) {
      return parsedObj.pathname.replace('/collections/', '/search/');
    }
    return parsedObj.pathname;
  } catch {
    return url;
  }
}
