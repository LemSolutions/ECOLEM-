'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';
import type { Product } from '@/types/database';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    price_type: 'fixed' as 'fixed' | 'starting_from' | 'on_request',
    category: '',
    image_url: '',
    features: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
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
      price: formData.price ? parseFloat(formData.price) : null,
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    try {
      if (editingId) {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      short_description: product.short_description || '',
      price: product.price?.toString() || '',
      price_type: product.price_type,
      category: product.category || '',
      image_url: product.image_url || '',
      features: (product.features || []).join('\n'),
      is_featured: product.is_featured,
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: '',
      price_type: 'fixed',
      category: '',
      image_url: '',
      features: '',
      is_featured: false,
      is_active: true,
      sort_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatPrice = (product: Product) => {
    if (product.price_type === 'on_request') return 'Su richiesta';
    if (!product.price) return '-';
    const formatted = `€${product.price.toFixed(2)}`;
    return product.price_type === 'starting_from' ? `Da ${formatted}` : formatted;
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
              <h1 className="text-xl font-bold text-gray-900">Prodotti</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              + Nuovo Prodotto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descrizione Breve</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descrizione Completa</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prezzo (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo Prezzo</label>
                    <select
                      value={formData.price_type}
                      onChange={(e) => setFormData({ ...formData, price_type: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="fixed">Fisso</option>
                      <option value="starting_from">A partire da</option>
                      <option value="on_request">Su richiesta</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="es. Hardware, Software, Consulenza"
                  />
                </div>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Immagine Prodotto"
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Features (una per riga)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Ordine</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Attivo</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">In evidenza</span>
                    </label>
                  </div>
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
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    {editingId ? 'Salva Modifiche' : 'Crea Prodotto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <p>Caricamento...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nessun prodotto trovato</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-emerald-600 hover:underline"
            >
              Crea il primo prodotto
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Prodotto</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Prezzo</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stato</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category || 'No categoria'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatPrice(product)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.is_active ? 'Attivo' : 'Bozza'}
                        </span>
                        {product.is_featured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                            In evidenza
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-emerald-600 hover:underline mr-4"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
