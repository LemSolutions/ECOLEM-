'use client';

import Image from 'next/image';
import type { Popup } from '@/types/database';

interface PopupProps {
  popup: Popup;
  onClose: () => void;
}

export default function PopupComponent({ popup, onClose }: PopupProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isInternalLink = (url: string) =>
    url.startsWith('#') || url.startsWith('/');

  const getAnchorId = (url: string): string | null => {
    if (!url) return null;
    const hash = url.includes('#') ? url.split('#')[1]?.split('?')[0] : null;
    return hash || (url.startsWith('#') ? url.slice(1).split('?')[0] : null);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!popup.cta_url) return;

    const anchorId = getAnchorId(popup.cta_url);
    const isInternalAnchor = popup.cta_url.includes('#') || popup.cta_url.startsWith('/');

    if (anchorId && isInternalAnchor) {
      e.preventDefault();
      onClose();
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        } else {
          window.location.href = `/#${anchorId}`;
        }
      }, 150);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          aria-label="Chiudi popup"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {popup.image_url && (
          <div className="relative w-full h-64 bg-gray-100 flex-shrink-0">
            <Image
              src={popup.image_url}
              alt={popup.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {/* Type Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                popup.type === 'evento'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {popup.type === 'evento' ? 'Evento' : 'Sconto'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{popup.title}</h2>

          {/* Date */}
          {popup.event_date && (
            <p className="text-sm text-gray-600 mb-4">
              {popup.type === 'evento' ? 'Data evento:' : 'Valido fino al:'}{' '}
              <span className="font-semibold">{formatDate(popup.event_date)}</span>
            </p>
          )}

          {/* Description */}
          {popup.description && (
            <div className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">
              {popup.description}
            </div>
          )}

          {/* CTA Button */}
          {popup.cta_text && popup.cta_url && (
            <a
              href={popup.cta_url.startsWith('#') ? `/${popup.cta_url}` : popup.cta_url}
              onClick={handleCtaClick}
              {...(!isInternalLink(popup.cta_url) && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              {popup.cta_text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
