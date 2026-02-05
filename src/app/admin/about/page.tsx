'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AboutSection } from '@/types/database';

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    image_position: 'left' as 'left' | 'right' | 'top' | 'bottom',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      subtitle: formData.subtitle || null,
      image_url: formData.image_url || null,
    };

    try {
      if (editingId) {
        await fetch('/api/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch('/api/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchSections();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa sezione?')) return;
    try {
      await fetch(`/api/about?id=${id}`, { method: 'DELETE' });
      fetchSections();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (section: AboutSection) => {
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      content: section.content,
      image_url: section.image_url || '',
      image_position: section.image_position,
      is_active: section.is_active,
      sort_order: section.sort_order,
    });
    setEditingId(section.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      image_position: 'left',
      is_active: true,
      sort_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">About Us</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              + Nuova Sezione
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Modifica Sezione' : 'Nuova Sezione'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titolo *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sottotitolo</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contenuto *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Immagine</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Posizione Immagine</label>
                    <select
                      value={formData.image_position}
                      onChange={(e) => setFormData({ ...formData, image_position: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="left">Sinistra</option>
                      <option value="right">Destra</option>
                      <option value="top">Sopra</option>
                      <option value="bottom">Sotto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ordine</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">Sezione attiva (visibile sul sito)</label>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    {editingId ? 'Salva Modifiche' : 'Crea Sezione'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sections List */}
        {loading ? (
          <p>Caricamento...</p>
        ) : sections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nessuna sezione trovata</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-purple-600 hover:underline"
            >
              Crea la prima sezione
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Titolo</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stato</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Ordine</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {section.subtitle || section.content.substring(0, 100)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        section.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {section.is_active ? 'Attivo' : 'Bozza'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{section.sort_order}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-purple-600 hover:underline mr-4"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-600 hover:underline"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
