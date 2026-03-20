/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEZIONI DEL SITO — Configurazione centralizzata
 * Usa questi anchor per campagne, popup, link interni.
 * URL formato: https://lemsolutions.it/#{anchor}
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SectionConfig {
  id: string;
  label: string;
  anchor: string;
  description: string;
  icon?: string;
}

/** Tutte le sezioni della homepage con i loro anchor ID */
export const SITE_SECTIONS: SectionConfig[] = [
  { id: 'hero', anchor: '#hero', label: 'Home', description: 'Sezione hero inizio pagina', icon: '🏠' },
  { id: 'identita-valori', anchor: '#identita-valori', label: 'Identità e Valori', description: 'Know-how e processo di trasformazione', icon: '🎯' },
  { id: 'servizi', anchor: '#servizi', label: 'Servizi', description: 'Il nostro sistema', icon: '⚙️' },
  { id: 'prodotti', anchor: '#prodotti', label: 'Prodotti', description: 'Il nostro catalogo', icon: '📦' },
  { id: 'chi-siamo', anchor: '#chi-siamo', label: 'Chi Siamo', description: 'La nostra storia', icon: '👥' },
  { id: 'blog', anchor: '#blog', label: 'Blog', description: 'Notizie e aggiornamenti', icon: '📰' },
  { id: 'support', anchor: '#support', label: 'Contattaci', description: 'Form contatti e preventivo', icon: '📞' },
  { id: 'statistiche', anchor: '#statistiche', label: 'Statistiche', description: 'Numeri e cifre', icon: '📊' },
];

/** Per popup e campagne: sezioni principali (escluse hero e statistiche) */
export const SITE_SECTIONS_FOR_LINKS = SITE_SECTIONS.filter(
  (s) => !['hero', 'statistiche'].includes(s.id)
);

/** Per popup: sezioni + variante "Preventivo" (punta a #support come Contattaci) */
export const SITE_SECTIONS_WITH_PREVENTIVO: SectionConfig[] = [
  ...SITE_SECTIONS_FOR_LINKS,
  { id: 'preventivo', anchor: '#support', label: 'Preventivo', description: 'Richiedi un preventivo', icon: '📋' },
];

/** Base URL — da env o fallback. Usata per campagne, link, documentazione. */
export const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemsolutions.it';

/** Path SDS — sempre /sds, funziona su qualsiasi dominio */
export const SDS_PATH = '/sds';

/**
 * Genera l'URL completo per una sezione (per campagne email, ads, ecc.)
 * Es: getSectionUrl('support') → 'https://lemsolutions.it/#support'
 */
export function getSectionUrl(anchorId: string, baseUrl = SITE_BASE_URL): string {
  const anchor = anchorId.startsWith('#') ? anchorId : `#${anchorId}`;
  return `${baseUrl.replace(/\/$/, '')}${anchor}`;
}

/** URL SDS — usa base da env, funziona ovunque */
export function getSdsUrl(): string {
  return `${SITE_BASE_URL.replace(/\/$/, '')}${SDS_PATH}`;
}
