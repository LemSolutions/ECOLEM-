'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';
import type { Product, ProductSdsDocument } from '@/types/database';

interface ProductWithSds extends Product {
  sds_documents?: ProductSdsDocument[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithSds[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sdsProductId, setSdsProductId] = useState<string | null>(null);
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

  const productForSds = sdsProductId ? products.find((p) => p.id === sdsProductId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Prodotti</h1>
              <Link
                href="/sds"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                Vedi pagina SDS →
              </Link>
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
                      onChange={(e) => setFormData({ ...formData, price_type: e.target.value as 'fixed' | 'starting_from' | 'on_request' })}
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

        {sdsProductId && productForSds && (
          <ProductSdsModal
            product={productForSds}
            onClose={() => setSdsProductId(null)}
            onSaved={() => setSdsProductId(null)}
          />
        )}

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
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">SDS / Certificati</th>
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
                      <button
                        onClick={() => setSdsProductId(product.id)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Gestisci documenti
                      </button>
                    </td>
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

type DocumentType = 'sds' | 'certificate_of_origin';

function ProductSdsModal({
  product,
  onClose,
  onSaved,
}: {
  product: ProductWithSds;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [docs, setDocs] = useState<ProductSdsDocument[]>(product.sds_documents || []);
  const [loading, setLoading] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<DocumentType>('sds');

  const fetchDocs = async () => {
    try {
      const res = await fetch(`/api/sds?product=${product.id}`);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch {
      setDocs([]);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [product.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/sds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          document_type: newType,
          label: newLabel.trim(),
          file_url: newUrl.trim(),
          file_name: newUrl.split('/').pop() || null,
        }),
      });
      setNewLabel('');
      setNewUrl('');
      await fetchDocs();
    } catch (error) {
      console.error('Error adding SDS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo documento?')) return;
    try {
      await fetch(`/api/sds?id=${id}`, { method: 'DELETE' });
      await fetchDocs();
    } catch (error) {
      console.error('Error deleting SDS:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            SDS e Certificati — {product.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as DocumentType)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="sds">Scheda di sicurezza</option>
              <option value="certificate_of_origin">Certificato di origine</option>
            </select>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={newType === 'sds' ? 'Es: SDS Toner Ceramico' : 'Es: Certificato C265'}
              className="flex-1 min-w-[140px] px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL PDF (https://...)"
              className="flex-1 min-w-[180px] px-3 py-2 border rounded-lg text-sm"
            />
            <button
            type="submit"
              disabled={loading || !newLabel.trim() || !newUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Aggiungi
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {docs.length === 0 ? (
            <p className="text-sm text-gray-500">Nessun documento. Aggiungi l&apos;URL della scheda di sicurezza o del certificato di origine (PDF).</p>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      doc.document_type === 'certificate_of_origin'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {doc.document_type === 'certificate_of_origin' ? 'Certificato' : 'SDS'}
                    </span>
                    <p className="font-medium text-sm truncate">{doc.label}</p>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate block"
                  >
                    {doc.file_url}
                  </a>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                  >
                    Scarica
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onSaved}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
