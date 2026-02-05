'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    image_url: '',
    category: '',
    tags: '',
    is_published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
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
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    try {
      if (editingId) {
        await fetch('/api/blog', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    try {
      await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author || '',
      image_url: post.image_url || '',
      category: post.category || '',
      tags: (post.tags || []).join(', '),
      is_published: post.is_published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      image_url: '',
      category: '',
      tags: '',
      is_published: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
              <h1 className="text-xl font-bold text-gray-900">Blog</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              + Nuovo Articolo
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
                {editingId ? 'Modifica Articolo' : 'Nuovo Articolo'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titolo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estratto</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Breve descrizione dell'articolo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contenuto</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                    rows={12}
                    required
                    placeholder="Scrivi il contenuto dell'articolo qui... (supporta Markdown)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Autore</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="es. Tech, News, Guide"
                    />
                  </div>
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
                  {formData.image_url && formData.image_url.trim() !== '' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Anteprima:</p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                        <img
                          src={formData.image_url}
                          alt="Anteprima"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement!.innerHTML = `
                              <div class="flex items-center justify-center h-full text-red-500 text-sm">
                                ❌ Errore: URL immagine non valido o non accessibile
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 break-all">{formData.image_url}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (separati da virgola)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="es. tecnologia, business, innovazione"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium">
                    Pubblica articolo
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingId ? 'Salva Modifiche' : 'Crea Articolo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <p>Caricamento...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nessun articolo trovato</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-purple-600 hover:underline"
            >
              Scrivi il primo articolo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Articolo</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Autore</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Data</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stato</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.image_url && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-gray-500">{post.category || 'No categoria'}</p>
                          {post.image_url && (
                            <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                              {post.image_url}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{post.author || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(post.published_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {post.is_published ? 'Pubblicato' : 'Bozza'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-purple-600 hover:underline mr-4"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
