import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

export const useSEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | Maig'Up France`;

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') || '';
    if (meta) {
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prev;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, [title, description]);
};
