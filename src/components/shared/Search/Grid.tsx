import { cn } from '@/lib/utils';

export default function Grid(props: React.ComponentProps<'ul'>) {
  return (
    <ul
      {...props}
      className={cn(
        'grid grid-flow-row gap-x-6 gap-y-12 md:gap-y-16',
        props.className
      )}
    >
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<'li'>) {
  return (
    <li
      {...props}
      className={cn('relative w-full transition-opacity', props.className)}
    >
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;
