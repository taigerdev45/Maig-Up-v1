import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordVisit } from '@/services/api';

const pageLabels: Record<string, string> = {
  '/': 'Accueil',
  '/a-propos': 'À propos',
  '/services': 'Services',
  '/temoignages': 'Témoignages',
  '/contact': 'Contact',
  '/login': 'Connexion',
};

export const usePageVisit = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Only track public pages
    if (path.startsWith('/admin')) return;

    const label = pageLabels[path] || path;
    recordVisit(label).catch(() => {});
  }, [location.pathname]);
};
