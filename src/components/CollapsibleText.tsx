import { useEffect, useId, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  lines?: number;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
};

export default function CollapsibleText({
  children,
  lines = 3,
  moreLabel = "Vis mer",
  lessLabel = "Skjul",
  className
}: Props) {
  const contentId = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only show the toggle when clamping actually hides content.
    const measure = () => {
      if (expanded) return;
      setCanExpand(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  return (
    <div className={className}>
      <div
        id={contentId}
        ref={ref}
        style={
          expanded
            ? undefined
            : ({
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: lines,
                overflow: "hidden"
              } as React.CSSProperties)
        }
      >
        {children}
      </div>

      {canExpand ? (
        <button
          type="button"
          className="mt-2 inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
}

