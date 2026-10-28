import { useEffect, useState } from 'react';

interface ScrollTriggerProps {
  onReach: () => void;
}

export const ScrollTrigger = ({ onReach }: ScrollTriggerProps) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onReach();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, onReach]);

  return <div ref={setNode} />;
};
