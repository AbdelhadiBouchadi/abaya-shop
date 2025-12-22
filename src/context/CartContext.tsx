'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { Cart, CartItem, Product, ProductVariant } from '@/lib/shopify/types';
import {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
  useState,
  startTransition,
} from 'react';
import {
  updateItemQuantity,
  removeItem,
} from '@/components/shared/Cart/actions';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (
    merchandiseId: string,
    updateType: UpdateType,
    maxQuantity?: number
  ) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: {
        merchandiseId: string;
        updateType: UpdateType;
        maxQuantity?: number;
      };
    }
  | {
      type: 'ADD_ITEM';
      payload: { variant: ProductVariant; product: Product };
    };

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'MAD' },
      totalAmount: { amount: '0', currencyCode: 'MAD' },
      totalTaxAmount: { amount: '0', currencyCode: 'MAD' },
    },
  };
}

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItemReducer(
  item: CartItem,
  updateType: UpdateType
): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity =
    updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString()
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );

  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'MAD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItemReducer(item, updateType)
            : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: '0' },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case 'ADD_ITEM': {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // --- THE FIX IS HERE ---
  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    // 1. Get current item to calculate payload for server
    const item = optimisticCart?.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (!item) return;

    // 2. Wrap everything in startTransition
    startTransition(async () => {
      // A. Optimistic Update (Immediate UI feedback)
      updateOptimisticCart({
        type: 'UPDATE_ITEM',
        payload: { merchandiseId, updateType },
      });

      // B. Server Action (Actual data persistence)
      try {
        if (updateType === 'delete') {
          await removeItem(null, merchandiseId);
        } else if (updateType === 'plus') {
          await updateItemQuantity(null, {
            merchandiseId,
            quantity: item.quantity + 1,
          });
        } else if (updateType === 'minus') {
          await updateItemQuantity(null, {
            merchandiseId,
            quantity: item.quantity - 1,
          });
        }
      } catch (e) {
        // If server action fails, the revalidation (or lack thereof)
        // will naturally sync the cart back to truth on next refresh.
        console.error('Error updating cart:', e);
      }
    });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    startTransition(() => {
      updateOptimisticCart({ type: 'ADD_ITEM', payload: { variant, product } });
    });
    openCart();
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      isOpen,
      openCart,
      closeCart,
    }),
    [optimisticCart, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
