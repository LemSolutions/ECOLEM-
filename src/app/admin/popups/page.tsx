'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Popup, PopupInsert } from '@/types/database';
import { SITE_SECTIONS_WITH_PREVENTIVO, getSectionUrl } from '@/config/sections';

/** Sezioni per il bottone popup — usa anchor #section (es. #support, #blog) */
const SITE_PAGES = SITE_SECTIONS_WITH_PREVENTIVO.map((s) => ({
  label: s.label,
  url: s.anchor,
  icon: s.icon || '🔗',
  description: s.description,
}));

interface FormData extends Partial<PopupInsert> {
  ctaMode: 'none' | 'page' | 'custom';
}

export default function PopupsPage() {
  const router = useRouter();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image_url: '',
    type: 'evento',
    event_date: '',
    cta_text: '',
    cta_url: '',
    is_active: true,
    display_order: 0,
    ctaMode: 'none',
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const response = await fetch('/api/popups');
      if (response.ok) {
        const data = await response.json();
        setPopups(data);
      }
    } catch (error) {
      console.error('Error fetching popups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      if (formData.ctaMode === 'none') {
        submitData.cta_text = '';
        submitData.cta_url = '';
      }

      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...submitData, id: editingId } : submitData;
      const { ctaMode, ...bodyWithoutMode } = body as FormData & { id?: string };

      const response = await fetch('/api/popups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyWithoutMode),
      });

      if (response.ok) {
        await fetchPopups();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Errore: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving popup:', error);
      alert('Errore nel salvataggio');
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingId(popup.id);
    let ctaMode: FormData['ctaMode'] = 'none';
    if (popup.cta_text && popup.cta_url) {
      const isPage = SITE_PAGES.some((p) => p.url === popup.cta_url);
      ctaMode = isPage ? 'page' : 'custom';
    }
    setFormData({
      title: popup.title,
      description: popup.description || '',
      image_url: popup.image_url || '',
      type: popup.type,
      event_date: popup.event_date ? new Date(popup.event_date).toISOString().slice(0, 16) : '',
      cta_text: popup.cta_text || '',
      cta_url: popup.cta_url || '',
      is_active: popup.is_active,
      display_order: popup.display_order,
      ctaMode,
    });
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('popup-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo pop-up?')) return;
    try {
      const response = await fetch(`/api/popups?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchPopups();
      } else {
        alert("Errore nell'eliminazione");
      }
    } catch {
      alert("Errore nell'eliminazione");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      type: 'evento',
      event_date: '',
      cta_text: '',
      cta_url: '',
      is_active: true,
      display_order: popups.length,
      ctaMode: 'none',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleActive = async (popup: Popup) => {
    try {
      const response = await fetch('/api/popups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: popup.id, is_active: !popup.is_active }),
      });
      if (response.ok) await fetchPopups();
    } catch (error) {
      console.error('Error toggling popup:', error);
    }
  };

  const moveOrder = async (popup: Popup, direction: 'up' | 'down') => {
    const sorted = [...popups].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((p) => p.id === popup.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const swapTarget = sorted[swapIdx];
    setSavingOrder(popup.id);
    try {
      await Promise.all([
        fetch('/api/popups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: popup.id, display_order: swapTarget.display_order }),
        }),
        fetch('/api/popups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swapTarget.id, display_order: popup.display_order }),
        }),
      ]);
      await fetchPopups();
    } catch {
      alert('Errore nel riordinamento');
    } finally {
      setSavingOrder(null);
    }
  };

  const selectPage = (page: (typeof SITE_PAGES)[0]) => {
    setFormData({
      ...formData,
      ctaMode: 'page',
      cta_url: page.url,
      cta_text: page.label,
    });
  };

  const sortedPopups = [...popups].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestione Pop-up</h1>
              {popups.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {popups.filter((p) => p.is_active).length} attivi / {popups.length} totali
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/?show_popup=1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                title="Apre il sito con la popup forzata (bypassa il blocco 24h)"
              >
                👁️ Testa popup
              </a>
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setFormData((prev) => ({ ...prev, display_order: popups.length, ctaMode: 'none' }));
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  + Nuovo Pop-up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ─── FORM ─── */}
        {showForm && (
          <div id="popup-form" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? '✏️ Modifica Pop-up' : '✨ Nuovo Pop-up'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* ── SEZIONE 1: Info base ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Informazioni principali
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titolo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Es: Offerta Primavera 2025, Evento Open Day..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['evento', 'sconto'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t })}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                            formData.type === t
                              ? t === 'evento'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {t === 'evento' ? '📅 Evento' : '🏷️ Sconto'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === 'evento' ? 'Data evento' : 'Valido fino al'}
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.event_date || ''}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Descrivi brevemente l'evento o l'offerta..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Immagine</label>
                    <input
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* ── SEZIONE 2: Bottone CTA ── */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Bottone (Opzionale)
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  Aggiungi un bottone per portare l'utente su una sezione del sito (es. lemsolutions.it/#support)
                </p>
                <details className="mb-4 text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">
                    📋 URL per campagne (email, ads, social)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-[11px] space-y-1">
                    {SITE_PAGES.map((p) => (
                      <div key={`${p.label}-${p.url}`}>
                        {p.label}: <span className="text-blue-600">{getSectionUrl(p.url.replace('#', ''))}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Step 1: Scegli destinazione */}
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  1. Scegli la pagina di destinazione
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {/* Nessun bottone */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ctaMode: 'none', cta_text: '', cta_url: '' })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm transition ${
                      formData.ctaMode === 'none'
                        ? 'border-gray-400 bg-gray-50 text-gray-700 font-medium'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-base">🚫</span>
                    <span>Nessun bottone</span>
                  </button>

                  {/* Pagine del sito */}
                  {SITE_PAGES.map((page) => {
                    const isSelected =
                      formData.ctaMode === 'page' && formData.cta_url === page.url;
                    return (
                      <button
                        key={page.label}
                        type="button"
                        onClick={() => selectPage(page)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <span className="text-base">{page.icon}</span>
                        <div className="text-left">
                          <div className="font-medium leading-tight">{page.label}</div>
                          <div className="text-xs opacity-60 leading-tight">{page.description}</div>
                        </div>
                      </button>
                    );
                  })}

                  {/* URL personalizzato */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, ctaMode: 'custom', cta_url: '', cta_text: formData.cta_text || '' })
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm transition ${
                      formData.ctaMode === 'custom'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-purple-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <span className="text-base">🔗</span>
                    <div className="text-left">
                      <div className="font-medium leading-tight">URL personalizzato</div>
                      <div className="text-xs opacity-60 leading-tight">Link esterno</div>
                    </div>
                  </button>
                </div>

                {/* Step 2: Personalizza testo e URL */}
                {formData.ctaMode !== 'none' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      2. Personalizza il bottone
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Testo del bottone
                        </label>
                        <input
                          type="text"
                          value={formData.cta_text || ''}
                          onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                          placeholder="Es: Contattaci subito, Scopri di più..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      {formData.ctaMode === 'custom' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                          <input
                            type="text"
                            value={formData.cta_url || ''}
                            onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                            placeholder="https://... oppure #sezione"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      )}
                      {formData.ctaMode === 'page' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Destinazione (URL per campagne)
                          </label>
                          <div className="flex flex-col gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                            <span className="font-mono text-xs text-blue-600 break-all">
                              {getSectionUrl(formData.cta_url?.replace('#', '') || '')}
                            </span>
                            <span className="text-xs text-gray-400">Anchor: {formData.cta_url}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.cta_text && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Anteprima:</span>
                        <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium">
                          {formData.cta_text}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── SEZIONE 3: Impostazioni ── */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Impostazioni
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Posizione in classifica
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center"
                      />
                      <span className="text-xs text-gray-400">
                        (0 = primo, più basso = priorità maggiore)
                      </span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        formData.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          formData.is_active ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.is_active ? 'Pop-up attivo' : 'Pop-up inattivo'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="border-t border-gray-100 pt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  {editingId ? '✓ Salva Modifiche' : '✨ Crea Pop-up'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── LISTA POP-UP ─── */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Caricamento...</div>
        ) : sortedPopups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-gray-500 font-medium mb-1">Nessun pop-up creato</p>
            <p className="text-sm text-gray-400">Clicca su "Nuovo Pop-up" per crearne uno.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-700">
                  Classifica pop-up — ordine di visualizzazione
                </h2>
                <p className="text-xs text-gray-400">
                  Usa le frecce per cambiare la priorità
                </p>
              </div>
              <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Se non vedi la popup sul sito: verifica che sia <strong>Attivo</strong>, che non sia scaduta (sconto con data passata), e usa <strong>Testa popup</strong> per bypassare il blocco 24h dopo chiusura.
              </p>
            </div>

            <div className="space-y-3">
              {sortedPopups.map((popup, idx) => {
                const isEditing = editingId === popup.id;
                return (
                <div
                  key={popup.id}
                  className={`relative bg-white rounded-xl border-2 transition-all ${
                    isEditing
                      ? 'border-blue-400 ring-2 ring-blue-300'
                      : popup.is_active
                      ? 'border-green-200'
                      : 'border-gray-200'
                  } overflow-hidden flex`}
                >
                  {/* Editing overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 z-10 bg-blue-900/20 backdrop-blur-[2px] flex items-center justify-center rounded-xl pointer-events-none">
                      <div className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Stai modificando questo pop-up
                      </div>
                    </div>
                  )}

                  {/* Order Controls */}
                  <div className="flex flex-col items-center justify-between bg-gray-50 border-r border-gray-100 px-3 py-3 min-w-[56px]">
                    <button
                      onClick={() => moveOrder(popup, 'up')}
                      disabled={idx === 0 || savingOrder !== null || isEditing}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500"
                      title="Sposta su"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === 0
                            ? 'bg-yellow-400 text-white'
                            : idx === 1
                            ? 'bg-gray-300 text-gray-700'
                            : idx === 2
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    <button
                      onClick={() => moveOrder(popup, 'down')}
                      disabled={idx === sortedPopups.length - 1 || savingOrder !== null || isEditing}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500"
                      title="Sposta giù"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Image (if present) */}
                  {popup.image_url && (
                    <div className="relative w-24 sm:w-32 flex-shrink-0 bg-gray-100">
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
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 leading-tight">{popup.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            popup.type === 'evento'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {popup.type === 'evento' ? '📅 Evento' : '🏷️ Sconto'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            popup.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {popup.is_active ? '● Attivo' : '○ Inattivo'}
                        </span>
                      </div>
                    </div>

                    {popup.event_date && (
                      <p className="text-xs text-gray-400 mb-1">
                        {popup.type === 'evento' ? 'Data: ' : 'Scade il: '}
                        <span className="font-medium text-gray-600">
                          {new Date(popup.event_date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </p>
                    )}

                    {popup.description && (
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">{popup.description}</p>
                    )}

                    {popup.cta_text && popup.cta_url && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-md font-medium">
                          {popup.cta_text}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-xs font-mono text-gray-400">{popup.cta_url}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center pr-4 pl-2 py-4 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(popup)}
                      disabled={isEditing}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => toggleActive(popup)}
                      disabled={isEditing}
                      className={`px-3 py-1.5 rounded-lg transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
                        popup.is_active
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {popup.is_active ? 'Disattiva' : 'Attiva'}
                    </button>
                    <button
                      onClick={() => handleDelete(popup.id)}
                      disabled={isEditing}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
