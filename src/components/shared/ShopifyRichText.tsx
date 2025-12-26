import { cn } from '@/lib/utils';

type RichTextNode = {
  type: string;
  value?: string;
  bold?: boolean;
  italic?: boolean;
  children?: RichTextNode[];
};

interface ShopifyRichTextProps {
  data: string | object;
  className?: string;
}

export function ShopifyRichText({ data, className }: ShopifyRichTextProps) {
  if (!data) return null;

  if (typeof data === 'string') {
    if (data.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(data);
        return <RenderNodes nodes={parsed.children} className={className} />;
      } catch (err) {
        console.error(err);

        return (
          <div
            className={className}
            dangerouslySetInnerHTML={{ __html: data }}
          />
        );
      }
    }
    return (
      <div className={className} dangerouslySetInnerHTML={{ __html: data }} />
    );
  }

  if ('children' in data) {
    // @ts-expect-error -- data.children is untyped, casting to implicit RichTextNode
    return <RenderNodes nodes={data.children} className={className} />;
  }

  return null;
}

function RenderNodes({
  nodes,
  className,
}: {
  nodes: RichTextNode[];
  className?: string;
}) {
  if (!nodes) return null;

  return (
    <div className={cn('space-y-4 font-text', className)}>
      {nodes.map((node, i) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i}>
              {node.children?.map((child: RichTextNode, j: number) => {
                if (child.bold) return <strong key={j}>{child.value}</strong>;
                if (child.italic) return <em key={j}>{child.value}</em>;
                return <span key={j}>{child.value}</span>;
              })}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
