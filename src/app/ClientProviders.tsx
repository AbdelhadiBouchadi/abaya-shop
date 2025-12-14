'use client';

import { CartProvider } from '@/context/CartContext';
import { Cart } from '@/lib/shopify/types';

export default function ClientProviders({
  children,
  cart,
}: {
  children: React.ReactNode;
  cart: Promise<Cart | undefined>;
}) {
  return <CartProvider cartPromise={cart}>{children}</CartProvider>;
}
