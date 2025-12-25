'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { FaArrowRight } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { newsletterAction } from '@/lib/shopify/actions/newsletter.actions';

const initialState = {
  success: false,
  message: '',
};

export default function NewsletterForm() {
  const [state, action, isPending] = useActionState(
    newsletterAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 mt-2">
      <input
        name="email"
        type="email"
        placeholder="Votre email"
        disabled={isPending}
        className="w-full px-4 py-3 text-sm rounded-md border border-[#b88d6a]/40 bg-white/50 focus:outline-none focus:border-[#9d5035] focus:ring-1 focus:ring-[#9d5035] placeholder:text-gray-400 disabled:opacity-60 transition-all"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#3E2723] text-white font-semibold py-3 px-4 rounded-md hover:bg-[#9d5035] transition-colors duration-300 flex items-center justify-center gap-2 uppercase text-sm tracking-wider disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin h-4 w-4" /> Envoi...
          </>
        ) : (
          <>
            M&apos;inscrire <FaArrowRight className="text-xs" />
          </>
        )}
      </button>
    </form>
  );
}
