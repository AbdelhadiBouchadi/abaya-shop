'use client';

import { useEffect, useRef, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const cartCount =
    cart?.lines.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (cartRef.current && isMounted && cartCount > 0) {
      gsap.fromTo(
        cartRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out',
        }
      );
    }
  }, [cartCount, isMounted]);

  return (
    <>
      <div
        ref={cartRef}
        onClick={() => setCartOpen(true)}
        className="relative rounded-2xl p-3 cursor-pointer 
          transition-all duration-300 
          ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] 
          hover:scale-110 hover:shadow-lg 
          active:scale-95 active:shadow-inner 
          hover:bg-[#9d5035]
          bg-[#b88d6a]"
      >
        <FaShoppingBag className="text-lg font-light text-gray-200" />
        {isMounted && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[13px] bg-[#9d5035] text-gray-200 px-1.5 rounded-full shadow-md">
            {cartCount}
          </span>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
