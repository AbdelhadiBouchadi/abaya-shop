import { ElementType, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BoundedProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export const Bounded = forwardRef<HTMLElement, BoundedProps>(
  ({ as: Comp = 'section', className, children, ...restProps }, ref) => {
    return (
      <Comp ref={ref} className={cn('px-6', className)} {...restProps}>
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </Comp>
    );
  }
);

Bounded.displayName = 'Bounded';
