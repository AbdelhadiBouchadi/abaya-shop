'use client';

import { useEffect, useRef } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, updateCartItem } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const totalPrice = cart ? Number.parseFloat(cart.cost.totalAmount.amount) : 0;
  const currencyCode = cart?.cost.totalAmount.currencyCode || 'USD';

  useEffect(() => {
    if (drawerRef.current && backdropRef.current) {
      if (isOpen) {
        gsap.to(drawerRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(backdropRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(drawerRef.current, {
          opacity: 0,
          x: '100%',
          duration: 0.3,
          ease: 'power2.in',
        });
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isOpen]);

  if (!isOpen && !drawerRef.current) return null;

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 z-99 backdrop-blur-sm opacity-0 pointer-events-none"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-[#eeeeee] shadow-2xl z-100 
          flex flex-col opacity-0 translate-x-full"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-b-neutral-500/40">
          <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart || cart.lines.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            cart.lines.map((item) => {
              const unitPrice =
                Number.parseFloat(item.cost.totalAmount.amount) / item.quantity;

              return (
                <div
                  key={item.merchandise.id}
                  className="cart-item flex gap-3 items-center border-b border-b-neutral-500/40 pb-3"
                >
                  <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border border-neutral-500/40">
                    <Image
                      src={
                        item.merchandise.product.featuredImage.url ||
                        '/placeholder.svg'
                      }
                      alt={item.merchandise.product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col grow">
                    <span className="text-sm font-medium line-clamp-2">
                      {item.merchandise.product.title}
                    </span>
                    {item.merchandise.selectedOptions.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {item.merchandise.selectedOptions
                          .map((opt) => opt.value)
                          .join(' / ')}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateCartItem(item.merchandise.id, 'minus')
                        }
                        className="px-2 py-1 text-sm bg-red-200 rounded hover:bg-red-300 cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          updateCartItem(item.merchandise.id, 'plus')
                        }
                        className="px-2 py-1 text-sm bg-green-200 rounded hover:bg-green-300 cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-600">
                        {item.quantity} × {item.cost.totalAmount.currencyCode} $
                        {unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      updateCartItem(item.merchandise.id, 'delete')
                    }
                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="p-4 space-y-3 border-t border-t-neutral-500/40">
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>
                {currencyCode} ${totalPrice.toFixed(2)}
              </span>
            </div>

            <Link href="/checkout" passHref>
              <button
                onClick={onClose}
                className="w-full cursor-pointer bg-[#2F2F2F] text-white py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
              >
                Go to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
