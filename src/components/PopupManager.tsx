'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PopupComponent from './Popup';
import type { Popup } from '@/types/database';

const STORAGE_KEY = 'popup_dismissed';
const DISMISS_HOURS = 24;

export default function PopupManager() {
  const pathname = usePathname();
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const forceShow = typeof window !== 'undefined' && window.location.search.includes('show_popup=1');

    const canShowPopup = (): boolean => {
      if (forceShow) return true;
      if (typeof window === 'undefined') return false;
      try {
        const val = localStorage.getItem(STORAGE_KEY);
        if (!val) return true;
        const ts = parseInt(val, 10);
        if (isNaN(ts)) return true;
        const elapsed = Date.now() - ts;
        if (elapsed >= DISMISS_HOURS * 60 * 60 * 1000) {
          localStorage.removeItem(STORAGE_KEY);
          return true;
        }
        return false;
      } catch {
        return true;
      }
    };

    const fetchPopup = async () => {
      try {
        const response = await fetch('/api/popups?active=true', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        const popups = Array.isArray(data) ? data : [];
        if (popups.length === 0) return;
        if (!canShowPopup()) return;

        const activePopup = popups[0] as Popup;

        if (activePopup.event_date && activePopup.type === 'sconto') {
          const expired = new Date(activePopup.event_date) < new Date();
          if (expired) return;
        }

        setPopup(activePopup);
        setTimeout(() => setIsVisible(true), 400);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[PopupManager] Errore caricamento popup:', error);
        }
      }
    };

    fetchPopup();
  }, [pathname, isAdmin]);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined' && popup) {
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch {
        // ignore
      }
    }
  };

  if (isAdmin || !isVisible || !popup) return null;

  return <PopupComponent popup={popup} onClose={handleClose} />;
}
