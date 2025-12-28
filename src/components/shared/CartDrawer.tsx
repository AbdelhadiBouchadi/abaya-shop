'use client';

import { useEffect, useRef, useState } from 'react';
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';
import { createPortal, useFormStatus } from 'react-dom';
import { redirectToCheckout } from './Cart/actions';
import { DEFAULT_OPTION } from '@/lib/constants';
import Link from 'next/link';

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
  const currencyCode = cart?.cost.totalAmount.currencyCode || 'MAD';

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
        className="fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-[#fffdfa] shadow-2xl z-999 flex flex-col opacity-0 translate-x-full"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#b88d6a]/30">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-6 font-text">
          {!cart || cart.lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#5D4037]/60">
              <p className="text-lg font-medium">Votre Panier Est Vide.</p>
              <button
                onClick={onClose}
                className="text-[#9d5035] underline hover:text-[#8a462f] cursor-pointer"
              >
                Continuer vos achats
              </button>
            </div>
          ) : (
            cart.lines.map((item) => {
              const unitPrice =
                Number.parseFloat(item.cost.totalAmount.amount) / item.quantity;

              // --- STOCK LOGIC ---
              const maxStock = item.merchandise.quantityAvailable ?? 100;
              const isMaxedOut = item.quantity >= maxStock;

              return (
                <div
                  key={item.id}
                  className="cart-item flex gap-4 items-start border-b border-[#b88d6a]/20 pb-6 last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-20 aspect-3/4 shrink-0 rounded-lg overflow-hidden border border-[#b88d6a]/20 bg-[#f4f1ed]">
                    <Image
                      src={
                        item.merchandise.product.featuredImage?.url ||
                        '/placeholder.svg'
                      }
                      alt={item.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col grow justify-between min-h-20">
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.merchandise.product.handle}`}
                        onClick={onClose}
                      >
                        <h3 className="text-sm font-bold text-[#3E2723] hover:text-[#9d5035] leading-tight">
                          {item.merchandise.product.title}
                        </h3>
                      </Link>

                      {/* VARIANT OPTIONS (Color / Size) */}
                      {item.merchandise.title !== DEFAULT_OPTION && (
                        <p className="text-xs text-[#5D4037]/70">
                          {item.merchandise.selectedOptions
                            .map((option) => option.value)
                            .join(' / ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-xl border border-[#b88d6a]/30 bg-white shadow-sm h-8 px-1">
                          <button
                            onClick={() =>
                              updateCartItem(item.merchandise.id, 'minus')
                            }
                            className="p-2 text-[#5D4037] hover:text-[#3E2723] disabled:opacity-30 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#3E2723]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItem(item.merchandise.id, 'plus')
                            }
                            className="p-2 text-[#5D4037] hover:text-[#3E2723] disabled:opacity-30 transition-colors"
                            disabled={isMaxedOut}
                            title={isMaxedOut ? 'Stock limit reached' : ''}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        {isMaxedOut && (
                          <span className="text-[10px] text-red-500 font-medium">
                            Max
                          </span>
                        )}
                      </div>

                      {/* Price & Delete */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-[#3E2723]">
                          {currencyCode} {unitPrice.toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(item.merchandise.id, 'delete')
                          }
                          className="text-xs text-red-400 hover:text-red-600 underline decoration-red-200 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="p-6 bg-[#fffdfa] border-t border-[#b88d6a]/20 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#5D4037]">
                <span>Sous-total</span>
                <span className="font-bold text-[#3E2723]">
                  {currencyCode} {totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-[#5D4037]/60 text-center">
                Frais de port et taxes calculés lors du paiement.
              </p>
            </div>

            <form action={redirectToCheckout}>
              <CheckoutButton />
            </form>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full relative flex justify-center items-center bg-[#3E2723] text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#5D4037] hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {pending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        'Continuer'
      )}
    </button>
  );
}
