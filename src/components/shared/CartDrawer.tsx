'use client';

import { useEffect, useRef, useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';
import { createPortal } from 'react-dom';
import { Link } from 'next-view-transitions';

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (drawerRef.current && backdropRef.current) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
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
        document.body.style.overflow = '';
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

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  if (!isOpen && !drawerRef.current) return null;

  return createPortal(
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 z-998 backdrop-blur-sm opacity-0 pointer-events-none"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-background/90 shadow-2xl z-999 
          flex flex-col opacity-0 translate-x-full"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* ... KEEP ALL YOUR INNER CONTENT EXACTLY THE SAME ... */}
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#b88d6a]/30">
          {/* ... code ... */}
          <h2 className="text-xl font-bold font-title tracking-tight text-[#9d5035]">
            Votre Panier
          </h2>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full hover:bg-[#b88d6a]/20 transition"
          >
            <FaTimes className="text-lg text-[#9d5035]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-text">
          {/* ... Copy your existing Items loop logic here ... */}
          {!cart || cart.lines.length === 0 ? (
            <p className="text-gray-500 text-sm">Votre Panier Est Vide.</p>
          ) : (
            cart.lines.map((item) => {
              /* ... existing map code ... */
              const unitPrice =
                Number.parseFloat(item.cost.totalAmount.amount) / item.quantity;
              return (
                <div
                  key={item.merchandise.id}
                  className="cart-item flex gap-3 items-center border-b border-[#b88d6a]/30 pb-3"
                >
                  {/* ... Image, Title, Quantity buttons ... */}
                  <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border border-[#b88d6a]/30">
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
                    <span className="text-sm font-medium line-clamp-2 text-[#9d5035]">
                      {item.merchandise.product.title}
                    </span>

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
                        className="px-2 py-1 text-sm bg-[#d1fa9d] rounded hover:bg-[#c0e98c] cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-600">
                        {item.quantity} × {item.cost.totalAmount.currencyCode}{' '}
                        {unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      updateCartItem(item.merchandise.id, 'delete')
                    }
                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
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
          <div className="p-4 space-y-3 border-t border-[#b88d6a]/30">
            <div className="flex justify-between text-sm font-medium text-[#9d5035]">
              <span>Total:</span>
              <span>
                {currencyCode} {totalPrice.toFixed(2)}
              </span>
            </div>
            <Link href="/checkout" passHref>
              <button
                onClick={onClose}
                className="w-full cursor-pointer bg-[#9d5035] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#8a462f] transition"
              >
                Continuer
              </button>
            </Link>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
