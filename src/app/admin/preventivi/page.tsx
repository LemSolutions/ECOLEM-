'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import type { QuoteProduct, QuotePackage, Quote, QuoteItem, QuotePackageItem } from '@/types/database';
import QuoteTemplate from '@/components/preventivi/QuoteTemplate';
import { exportQuoteAsPDF, exportQuoteAsImage, generateQuoteFilename } from '@/lib/quote-export';
import { translateText, type SupportedLanguage } from '@/lib/translation';

export default function PreventiviPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'packages' | 'create' | 'history'>('products');
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  
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
              <h1 className="text-xl font-bold text-gray-900">Preventivi</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Listino Prodotti
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'packages'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Pacchetti
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ➕ Nuovo Preventivo
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📁 Storico
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <ListinoProdotti />}
        {activeTab === 'packages' && <PacchettiPreconfigurati />}
            {activeTab === 'create' && <CreaPreventivo editQuoteId={editQuoteId} onEditComplete={() => setEditQuoteId(null)} />}
            {activeTab === 'history' && <StoricoPreventivi onEdit={(quoteId) => { setEditQuoteId(quoteId); setActiveTab('create'); }} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEZIONE 1: LISTINO PRODOTTI
// ═══════════════════════════════════════════════════════════════════════════

function ListinoProdotti() {
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'ceramica',
    base_price: '',
    unit: 'pz',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/preventivi/products');
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
      base_price: parseFloat(formData.base_price) || 0,
    };

    try {
      if (editingId) {
        await fetch('/api/preventivi/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch('/api/preventivi/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nel salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      await fetch(`/api/preventivi/products?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: QuoteProduct) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      base_price: product.base_price.toString(),
      unit: product.unit,
      is_active: product.is_active,
      display_order: product.display_order,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'ceramica',
      base_price: '',
      unit: 'pz',
      is_active: true,
      display_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Listino Prodotti Interni</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Aggiungi
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrizione</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="ceramica">Ceramica</option>
                    <option value="accessorio">Accessorio</option>
                    <option value="servizio">Servizio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prezzo Base (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unità</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="pz, set, ora"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Caricamento...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prezzo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unità</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{product.base_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-emerald-600 hover:text-emerald-700 mr-4"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEZIONE 2: PACCHETTI PRECONFIGURATI
// ═══════════════════════════════════════════════════════════════════════════

function PacchettiPreconfigurati() {
  const [packages, setPackages] = useState<QuotePackage[]>([]);
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    items: [] as QuotePackageItem[],
    discount_percentage: 0,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, productsRes] = await Promise.all([
        fetch('/api/preventivi/packages'),
        fetch('/api/preventivi/products'),
      ]);
      const packagesData = await packagesRes.json();
      const productsData = await productsRes.json();
      setPackages(Array.isArray(packagesData) ? packagesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    formData.items.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const price = item.price_override ?? product.base_price;
        subtotal += price * item.quantity;
      }
    });
    const discountAmount = (subtotal * formData.discount_percentage) / 100;
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { total } = calculateTotals();
    const payload = {
      ...formData,
      total_price: total,
    };

    try {
      if (editingId) {
        await fetch('/api/preventivi/packages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        await fetch('/api/preventivi/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nel salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo pacchetto?')) return;
    try {
      await fetch(`/api/preventivi/packages?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (pkg: QuotePackage) => {
    const items = Array.isArray(pkg.items) ? pkg.items as QuotePackageItem[] : [];
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      items,
      discount_percentage: pkg.discount_percentage,
      is_active: pkg.is_active,
      display_order: pkg.display_order,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      items: [],
      discount_percentage: 0,
      is_active: true,
      display_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1, price_override: undefined }],
    });
  };

  const handleRemoveProduct = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleProductChange = (index: number, field: keyof QuotePackageItem, value: string | number | undefined) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Pacchetti Preconfigurati</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Aggiungi
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Modifica Pacchetto' : 'Nuovo Pacchetto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome e descrizione */}
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrizione</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              {/* Prodotti del pacchetto */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium">📦 Prodotti del Pacchetto</label>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    + Aggiungi Prodotto
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, index) => {
                    const product = products.find((p) => p.id === item.product_id);
                    const price = item.price_override ?? product?.base_price ?? 0;
                    const itemTotal = price * item.quantity;
                    return (
                      <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
                        <select
                          value={item.product_id}
                          onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          required
                          title={product ? `${product.name} - ${product.description || ''}` : 'Seleziona un prodotto'}
                        >
                          <option value="">🔍 Seleziona prodotto...</option>
                          {products.map((p) => {
                            // Formato chiaro e intuitivo: Nome Prodotto | Descrizione breve | Prezzo
                            const productName = p.name || 'Prodotto senza nome';
                            const shortDesc = p.description 
                              ? (p.description.length > 50 ? p.description.substring(0, 47) + '...' : p.description)
                              : '';
                            const displayText = shortDesc 
                              ? `${productName} | ${shortDesc} | €${p.base_price.toFixed(2)}/${p.unit}`
                              : `${productName} | €${p.base_price.toFixed(2)}/${p.unit}`;
                            return (
                              <option key={p.id} value={p.id} title={p.description || p.name || ''}>
                                {displayText}
                              </option>
                            );
                          })}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 border rounded-lg"
                          placeholder="Qtà"
                          required
                        />
                        <div className="w-32">
                          <input
                            type="number"
                            step="0.01"
                            value={item.price_override ?? ''}
                            onChange={(e) => handleProductChange(index, 'price_override', e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder={`Prezzo (default: €${product?.base_price.toFixed(2) ?? '0.00'})`}
                          />
                        </div>
                        <span className="w-24 text-right font-medium">€{itemTotal.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ❌
                        </button>
                      </div>
                    );
                  })}
                  {formData.items.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Nessun prodotto aggiunto. Clicca su "+ Aggiungi Prodotto" per iniziare.
                    </div>
                  )}
                </div>
              </div>

              {/* Sconto e totale */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Subtotale:</span>
                  <span className="text-sm">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Sconto:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    <span className="text-sm">%</span>
                  </div>
                  <span className="text-sm text-red-600">
                    -€{discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
                  <span>TOTALE:</span>
                  <span className="text-emerald-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-8">Caricamento...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Nessun pacchetto configurato. Clicca su "+ Aggiungi" per crearne uno.
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-2">
                  €{pkg.total_price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {Array.isArray(pkg.items) ? pkg.items.length : 0} prodotti
                </p>
                {pkg.discount_percentage > 0 && (
                  <p className="text-sm text-red-600 mb-4">
                    Sconto: {pkg.discount_percentage}%
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-600 hover:text-red-700 px-4 py-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEZIONE 3: CREA PREVENTIVO
// ═══════════════════════════════════════════════════════════════════════════

function CreaPreventivo({ editQuoteId, onEditComplete }: { editQuoteId?: string | null; onEditComplete?: () => void }) {
  const [language, setLanguage] = useState<SupportedLanguage>('it');
  const [isTranslating, setIsTranslating] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [packageProductIds, setPackageProductIds] = useState<Set<string>>(new Set());
  const previousPackageRef = useRef<string>('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'iban' | 'banca' | 'bonifico' | 'altro' | ''>('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [packages, setPackages] = useState<QuotePackage[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedQuoteNumber, setSavedQuoteNumber] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [finalizedItems, setFinalizedItems] = useState<QuoteItem[]>([]);
  const [finalizedNotes, setFinalizedNotes] = useState<string>('');
  const [finalizedPaymentDetails, setFinalizedPaymentDetails] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  // Reset dello stato quando cambia editQuoteId
  useEffect(() => {
    if (editQuoteId) {
      setIsFinalized(false);
      setFinalizedItems([]);
      setFinalizedNotes('');
      setFinalizedPaymentDetails('');
    }
  }, [editQuoteId]);

  // Carica i dati del preventivo da modificare
  useEffect(() => {
    const loadQuoteForEdit = async () => {
      if (editQuoteId && products.length > 0) {
        setIsTranslating(true);
        setIsFinalized(false); // Reset finalizzazione quando si carica un preventivo
        try {
          const res = await fetch(`/api/preventivi/quotes?id=${editQuoteId}`);
          const quote: Quote = await res.json();
          
          if (quote) {
            setCustomerData({
              name: quote.customer_name,
              email: quote.customer_email || '',
              phone: quote.customer_phone || '',
              address: quote.customer_address || '',
            });
            setLanguage(quote.language);
            
            // Traduci gli items usando i prodotti originali dal database
            let translatedItems: QuoteItem[] = [];
            if (Array.isArray(quote.items) && quote.items.length > 0) {
              const itemsPromises = (quote.items as QuoteItem[]).map(async (item) => {
                // Se ha product_id, traduci dal prodotto originale italiano
                if (item.product_id) {
                  const product = products.find(p => p.id === item.product_id);
                  if (product) {
                    try {
                      const translatedName = await getTranslatedProductName(product, quote.language);
                      const translatedDescription = await getTranslatedProductDescription(product, quote.language);
                      return {
                        ...item,
                        product_name: translatedName,
                        description: translatedDescription,
                      };
                    } catch (error) {
                      console.error('Errore traduzione item:', error);
                      // Anche nel fallback, prova a tradurre se la lingua non è italiana
                      let fallbackName = product.name;
                      let fallbackDescription = product.description || undefined;
                      if (quote.language !== 'it') {
                        try {
                          fallbackName = await translateText(product.name, quote.language, 'it');
                          if (product.description) {
                            fallbackDescription = await translateText(product.description, quote.language, 'it');
                          }
                        } catch (translationError) {
                          console.error('Errore traduzione fallback:', translationError);
                        }
                      }
                      return {
                        ...item,
                        product_name: fallbackName,
                        description: fallbackDescription,
                      };
                    }
                  }
                }
                
                // Se non ha product_id ma ha nome/descrizione, traduci direttamente (assumendo italiano come sorgente)
                if (!item.product_id && (item.product_name || item.description) && quote.language !== 'it') {
                  try {
                    let translatedName = item.product_name;
                    let translatedDescription = item.description;
                    
                    if (item.product_name) {
                      translatedName = await translateText(item.product_name, quote.language, 'it');
                    }
                    if (item.description) {
                      translatedDescription = await translateText(item.description, quote.language, 'it');
                    }
                    
                    return {
                      ...item,
                      product_name: translatedName,
                      description: translatedDescription,
                    };
                  } catch (error) {
                    console.error('Errore traduzione item senza product_id:', error);
                    return item;
                  }
                }
                
                return item;
              });
              translatedItems = await Promise.all(itemsPromises);
            } else {
              translatedItems = Array.isArray(quote.items) ? quote.items as QuoteItem[] : [];
            }
            
            setItems(translatedItems);
            setDiscount(quote.discount_percentage);
            setNotes(quote.notes || '');
            setPaymentMethod((quote.payment_method as 'iban' | 'banca' | 'bonifico' | 'altro' | '') || '');
            setPaymentDetails(quote.payment_details || '');
            setValidityDays(quote.validity_days);
            setSavedQuoteNumber(quote.quote_number);
            setSelectedPackage(''); // Reset pacchetto quando si modifica
            setPackageProductIds(new Set());
          }
        } catch (error) {
          console.error('Errore caricamento preventivo:', error);
        } finally {
          setIsTranslating(false);
        }
      } else {
        // Reset form quando non c'è più editQuoteId
        setCustomerData({ name: '', email: '', phone: '', address: '' });
        setLanguage('it');
        setItems([]);
        setDiscount(0);
        setNotes('');
        setPaymentMethod('');
        setPaymentDetails('');
        setValidityDays(30);
        setSavedQuoteNumber(null);
        setSelectedPackage('');
        setPackageProductIds(new Set());
      }
    };
    
    loadQuoteForEdit();
  }, [editQuoteId, products]);

  const fetchData = async () => {
    try {
      const [productsRes, packagesRes] = await Promise.all([
        fetch('/api/preventivi/products'),
        fetch('/api/preventivi/packages'),
      ]);
      const productsData = await productsRes.json();
      const packagesData = await packagesRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  // Helper per ottenere il nome tradotto del prodotto (con traduzione automatica)
  const getTranslatedProductName = async (product: QuoteProduct, lang: SupportedLanguage): Promise<string> => {
    if (lang === 'it' || !product.name) return product.name;
    try {
      return await translateText(product.name, lang, 'it');
    } catch (error) {
      console.error('Errore traduzione nome prodotto:', error);
      return product.name;
    }
  };

  // Helper per ottenere la descrizione tradotta del prodotto (con traduzione automatica)
  const getTranslatedProductDescription = async (product: QuoteProduct, lang: SupportedLanguage): Promise<string | undefined> => {
    if (lang === 'it' || !product.description) return product.description || undefined;
    try {
      return await translateText(product.description, lang, 'it');
    } catch (error) {
      console.error('Errore traduzione descrizione prodotto:', error);
      return product.description || undefined;
    }
  };

  // Gestisce la selezione del pacchetto (solo quando cambia selectedPackage)
  useEffect(() => {
    const loadPackageItems = async () => {
      if (selectedPackage && packages.length > 0 && products.length > 0) {
        const selectedPkg = packages.find(p => p.id === selectedPackage);
        if (selectedPkg && Array.isArray(selectedPkg.items)) {
          setIsTranslating(true);
          try {
            // Carica i nuovi prodotti del pacchetto
            const packageItemsPromises = (selectedPkg.items as QuotePackageItem[]).map(async (pkgItem) => {
              const product = products.find(p => p.id === pkgItem.product_id);
              if (product) {
                const price = pkgItem.price_override ?? product.base_price;
                try {
                  // Traduci sempre dalla lingua italiana alla lingua selezionata
                  const translatedName = await getTranslatedProductName(product, language);
                  const translatedDescription = await getTranslatedProductDescription(product, language);
                  return {
                    product_id: product.id,
                    product_name: translatedName,
                    description: translatedDescription,
                    quantity: pkgItem.quantity,
                    unit_price: price,
                    total: price * pkgItem.quantity,
                  };
                } catch (error) {
                  console.error('Errore traduzione prodotto dal pacchetto:', error);
                  // Fallback: prova comunque a tradurre se la lingua non è italiana
                  let fallbackName = product.name;
                  let fallbackDescription = product.description || undefined;
                  if (language !== 'it') {
                    try {
                      fallbackName = await translateText(product.name, language, 'it');
                      if (product.description) {
                        fallbackDescription = await translateText(product.description, language, 'it');
                      }
                    } catch (translationError) {
                      console.error('Errore traduzione fallback pacchetto:', translationError);
                    }
                  }
                  return {
                    product_id: product.id,
                    product_name: fallbackName,
                    description: fallbackDescription,
                    quantity: pkgItem.quantity,
                    unit_price: price,
                    total: price * pkgItem.quantity,
                  };
                }
              }
              return null;
            });
            
            const newPackageItems = (await Promise.all(packageItemsPromises)).filter((item) => item !== null) as QuoteItem[];
            
            // Salva gli ID dei prodotti del pacchetto
            const newPackageProductIds = new Set(newPackageItems.map(item => item.product_id).filter(Boolean) as string[]);
            
            // Rimuovi i prodotti del pacchetto precedente e aggiungi quelli del nuovo pacchetto
            setItems(prevItems => {
              // Mantieni solo i prodotti NON del pacchetto precedente
              const manualItems = prevItems.filter(item => !packageProductIds.has(item.product_id || ''));
              // Aggiungi i prodotti del nuovo pacchetto
              return [...manualItems, ...newPackageItems];
            });
            
            // Aggiorna gli ID del pacchetto corrente
            setPackageProductIds(newPackageProductIds);
            previousPackageRef.current = selectedPackage;
            
            // Applica lo sconto del pacchetto se presente
            if (selectedPkg.discount_percentage > 0) {
              setDiscount(selectedPkg.discount_percentage);
            }
          } catch (error) {
            console.error('Errore caricamento pacchetto:', error);
          } finally {
            setIsTranslating(false);
          }
        }
      } else if (!selectedPackage && previousPackageRef.current) {
        // Quando deselezioni il pacchetto, rimuovi solo i prodotti del pacchetto
        setItems(prevItems => prevItems.filter(item => !packageProductIds.has(item.product_id || '')));
        setPackageProductIds(new Set());
        previousPackageRef.current = '';
        setDiscount(0);
      }
    };
    
    // Esegui solo se cambia selectedPackage, non quando cambia language
    if (previousPackageRef.current !== selectedPackage) {
      loadPackageItems();
    }
  }, [selectedPackage, packages, products]);

  // Aggiorna i nomi e descrizioni quando cambia la lingua
  useEffect(() => {
    const translateItems = async () => {
      // Traduci sempre se ci sono items e prodotti disponibili
      if (items.length > 0 && products.length > 0) {
        setIsTranslating(true);
        try {
          const updatedItemsPromises = items.map(async (item) => {
            // Se ha product_id, traduci SEMPRE dal prodotto originale italiano (sorgente sempre italiano)
            if (item.product_id) {
              const product = products.find(p => p.id === item.product_id);
              if (product) {
                try {
                  // Traduci sempre dalla lingua italiana alla lingua selezionata
                  const translatedName = await getTranslatedProductName(product, language);
                  const translatedDescription = await getTranslatedProductDescription(product, language);
                  return {
                    ...item,
                    product_name: translatedName,
                    description: translatedDescription,
                  };
                } catch (error) {
                  console.error('Errore traduzione item con product_id:', error);
                  // Fallback: prova comunque a tradurre se la lingua non è italiana
                  let fallbackName = product.name;
                  let fallbackDescription = product.description || undefined;
                  if (language !== 'it') {
                    try {
                      fallbackName = await translateText(product.name, language, 'it');
                      if (product.description) {
                        fallbackDescription = await translateText(product.description, language, 'it');
                      }
                    } catch (translationError) {
                      console.error('Errore traduzione fallback:', translationError);
                    }
                  }
                  return {
                    ...item,
                    product_name: fallbackName,
                    description: fallbackDescription,
                  };
                }
              }
            }
            
            // Se non ha product_id ma ha nome/descrizione, traduci direttamente (assumendo italiano come sorgente)
            if (!item.product_id && (item.product_name || item.description)) {
              try {
                let translatedName = item.product_name;
                let translatedDescription = item.description;
                
                if (language !== 'it') {
                  if (item.product_name) {
                    // Traduci sempre dall'italiano alla lingua selezionata
                    translatedName = await translateText(item.product_name, language, 'it');
                  }
                  if (item.description) {
                    translatedDescription = await translateText(item.description, language, 'it');
                  }
                } else {
                  // Se la lingua è italiana, mantieni il testo originale
                  translatedName = item.product_name;
                  translatedDescription = item.description;
                }
                
                return {
                  ...item,
                  product_name: translatedName,
                  description: translatedDescription,
                };
              } catch (error) {
                console.error('Errore traduzione item senza product_id:', error);
                return item;
              }
            }
            
            // Se non c'è nulla da tradurre, restituisci l'item così com'è
            return item;
          });
          
          const updatedItems = await Promise.all(updatedItemsPromises);
          setItems(updatedItems);
        } catch (error) {
          console.error('Errore traduzione items:', error);
        } finally {
          setIsTranslating(false);
        }
      }
    };
    
    // Esegui la traduzione solo se ci sono items e prodotti disponibili
    if (items.length > 0 && products.length > 0) {
      translateItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Traduci quando cambia la lingua - items e products sono usati dentro la funzione

  const handleAddItem = () => {
    setItems([...items, {
      product_name: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      const qty = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const price = field === 'unit_price' ? Number(value) : newItems[index].unit_price;
      newItems[index].total = qty * price;
    }
    setItems(newItems);
  };

  const handleSaveDraft = async () => {
    if (!customerData.name || items.length === 0) {
      alert('Compila almeno il nome del cliente e aggiungi almeno un prodotto');
      return;
    }

    try {
      const url = '/api/preventivi/quotes';
      const method = editQuoteId ? 'PUT' : 'POST';
      
      const body: any = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        language,
        items,
        subtotal,
        discount_percentage: discount,
        discount_amount: discountAmount,
        total,
        notes,
        payment_method: paymentMethod || undefined,
        payment_details: paymentDetails || undefined,
        validity_days: validityDays,
        status: 'draft',
      };
      
      if (editQuoteId) {
        body.id = editQuoteId;
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      if (data.quote_number) {
        setSavedQuoteNumber(data.quote_number);
      }
      alert(editQuoteId ? 'Preventivo aggiornato!' : 'Preventivo salvato come bozza!');
      if (editQuoteId && onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nel salvataggio');
    }
  };

  const handleExportPDF = async () => {
    if (!isFinalized) {
      alert('Devi prima finalizzare il preventivo prima di esportare il PDF');
      return;
    }
    
    if (!customerData.name || finalizedItems.length === 0) {
      alert('Compila almeno il nome del cliente e aggiungi almeno un prodotto');
      return;
    }

    setIsExporting(true);
    try {
      // Mostra il preview temporaneamente
      setShowPreview(true);
      
      // Aspetta che il DOM si aggiorni
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filename = generateQuoteFilename(savedQuoteNumber || undefined, 'pdf');
      await exportQuoteAsPDF('quote-template', filename);
      
      setShowPreview(false);
    } catch (error) {
      console.error('Errore export PDF:', error);
      alert('Errore durante l\'export PDF');
      setShowPreview(false);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!isFinalized) {
      alert('Devi prima finalizzare il preventivo prima di esportare l\'immagine');
      return;
    }
    
    if (!customerData.name || finalizedItems.length === 0) {
      alert('Compila almeno il nome del cliente e aggiungi almeno un prodotto');
      return;
    }

    setIsExporting(true);
    try {
      // Mostra il preview temporaneamente
      setShowPreview(true);
      
      // Aspetta che il DOM si aggiorni
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filename = generateQuoteFilename(savedQuoteNumber || undefined, 'png');
      await exportQuoteAsImage('quote-template', filename);
      
      setShowPreview(false);
    } catch (error) {
      console.error('Errore export immagine:', error);
      alert('Errore durante l\'export immagine');
      setShowPreview(false);
    } finally {
      setIsExporting(false);
    }
  };

  // Finalizza il preventivo traducendo tutti i contenuti dalla sorgente italiana originale
  const handleFinalizeQuote = async () => {
    if (!customerData.name || items.length === 0) {
      alert('Compila almeno il nome del cliente e aggiungi almeno un prodotto');
      return;
    }

    setIsTranslating(true);
    try {
      // Assicurati che i prodotti siano caricati
      if (products.length === 0) {
        await fetchData();
      }
      
      console.log(`[Finalizzazione] Inizio traduzione in ${language.toUpperCase()}...`);
      console.log(`[Finalizzazione] Items da tradurre: ${items.length}`);
      
      // Traduci TUTTI gli items SEMPRE dalla sorgente italiana originale
      const translatedItemsPromises = items.map(async (item, index) => {
        // Se ha product_id, traduci SEMPRE dal prodotto originale italiano (sorgente sempre italiana)
        if (item.product_id && products.length > 0) {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            try {
              // Traduci sempre dalla lingua italiana alla lingua selezionata
              let translatedName = product.name; // Nome originale italiano
              let translatedDescription = product.description || undefined; // Descrizione originale italiana
              
              if (language !== 'it') {
                console.log(`[Finalizzazione] Traduzione item ${index + 1}: "${product.name}" -> ${language}`);
                
                // Traduci nome prodotto
                if (product.name) {
                  translatedName = await translateText(product.name, language, 'it');
                  console.log(`[Finalizzazione] Nome tradotto: "${product.name}" -> "${translatedName}"`);
                }
                // Traduci descrizione prodotto
                if (product.description) {
                  translatedDescription = await translateText(product.description, language, 'it');
                  console.log(`[Finalizzazione] Descrizione tradotta: "${product.description.substring(0, 50)}..." -> "${translatedDescription?.substring(0, 50)}..."`);
                }
              }
              
              return {
                ...item,
                product_name: translatedName,
                description: translatedDescription,
              };
            } catch (error) {
              console.error(`[Finalizzazione] Errore traduzione item ${index + 1} con product_id:`, error);
              // Fallback: prova comunque a tradurre se la lingua non è italiana
              let fallbackName = product.name;
              let fallbackDescription = product.description || undefined;
              if (language !== 'it') {
                try {
                  fallbackName = await translateText(product.name, language, 'it');
                  if (product.description) {
                    fallbackDescription = await translateText(product.description, language, 'it');
                  }
                } catch (translationError) {
                  console.error('[Finalizzazione] Errore traduzione fallback:', translationError);
                }
              }
              return {
                ...item,
                product_name: fallbackName,
                description: fallbackDescription,
              };
            }
          }
        }
        
        // Se non ha product_id ma ha nome/descrizione, traduci direttamente (assumendo italiano come sorgente)
        if (!item.product_id && (item.product_name || item.description)) {
          try {
            let translatedName = item.product_name || '';
            let translatedDescription = item.description;
            
            if (language !== 'it') {
              console.log(`[Finalizzazione] Traduzione item ${index + 1} senza product_id: "${item.product_name}" -> ${language}`);
              
              // Traduci nome prodotto (assumendo che sia in italiano)
              if (item.product_name) {
                translatedName = await translateText(item.product_name, language, 'it');
                console.log(`[Finalizzazione] Nome tradotto: "${item.product_name}" -> "${translatedName}"`);
              }
              // Traduci descrizione prodotto (assumendo che sia in italiano)
              if (item.description) {
                translatedDescription = await translateText(item.description, language, 'it');
              }
            }
            
            return {
              ...item,
              product_name: translatedName,
              description: translatedDescription,
            };
          } catch (error) {
            console.error(`[Finalizzazione] Errore traduzione item ${index + 1} senza product_id:`, error);
            // Se la traduzione fallisce, mantieni i valori originali
            return item;
          }
        }
        
        // Se non c'è nulla da tradurre, restituisci l'item così com'è
        return item;
      });
      
      const translatedItems = await Promise.all(translatedItemsPromises);
      console.log(`[Finalizzazione] Items tradotti: ${translatedItems.length}`);
      
      // Traduci le note se presenti (sempre dall'italiano)
      let translatedNotes = notes;
      if (notes && language !== 'it') {
        try {
          console.log(`[Finalizzazione] Traduzione note...`);
          translatedNotes = await translateText(notes, language, 'it');
          console.log(`[Finalizzazione] Note tradotte`);
        } catch (error) {
          console.error('[Finalizzazione] Errore traduzione note:', error);
        }
      }
      
      // Traduci i dettagli di pagamento se presenti (sempre dall'italiano)
      let translatedPaymentDetails = paymentDetails;
      if (paymentDetails && language !== 'it') {
        try {
          console.log(`[Finalizzazione] Traduzione dettagli pagamento...`);
          translatedPaymentDetails = await translateText(paymentDetails, language, 'it');
          console.log(`[Finalizzazione] Dettagli pagamento tradotti`);
        } catch (error) {
          console.error('[Finalizzazione] Errore traduzione dettagli pagamento:', error);
        }
      }
      
      // REVISIONE FINALE: Pulisci i dati finalizzati rimuovendo campi vuoti/nulli
      // Rimuovi note se vuote o solo spazi
      const cleanedNotes = translatedNotes && translatedNotes.trim() ? translatedNotes.trim() : '';
      
      // Rimuovi payment_details se vuoto o solo spazi
      const cleanedPaymentDetails = translatedPaymentDetails && translatedPaymentDetails.trim() ? translatedPaymentDetails.trim() : '';
      
      // Se payment_method è selezionato ma payment_details è vuoto, mantieni solo il metodo
      // Se entrambi sono vuoti, rimuovi tutto
      const hasPaymentInfo = paymentMethod && paymentMethod.trim() !== '';
      const hasPaymentDetails = cleanedPaymentDetails !== '';
      
      // Pulisci gli items: rimuovi eventuali campi vuoti nelle descrizioni
      const cleanedItems = translatedItems.map(item => ({
        ...item,
        description: item.description && item.description.trim() ? item.description.trim() : undefined,
        product_name: item.product_name && item.product_name.trim() ? item.product_name.trim() : item.product_name,
      }));
      
      console.log(`[Finalizzazione] Revisione completata:`);
      console.log(`- Items: ${cleanedItems.length}`);
      console.log(`- Note: ${cleanedNotes ? 'Presenti' : 'Vuote (rimosse)'}`);
      console.log(`- Pagamento: ${hasPaymentInfo ? 'Presente' : 'Assente'}`);
      console.log(`- Dettagli pagamento: ${hasPaymentDetails ? 'Presenti' : 'Vuoti (rimossi)'}`);
      
      // Salva i dati finalizzati puliti (tutti tradotti dalla sorgente italiana)
      setFinalizedItems(cleanedItems);
      setFinalizedNotes(cleanedNotes);
      setFinalizedPaymentDetails(cleanedPaymentDetails);
      setIsFinalized(true);
      
      console.log(`[Finalizzazione] Preventivo finalizzato con successo in ${language.toUpperCase()}`);
      alert(`Preventivo finalizzato con successo! Tutti i contenuti sono stati tradotti in ${language.toUpperCase()} e revisionati. Campi vuoti sono stati rimossi. Ora puoi visualizzare l'anteprima ed esportare.`);
    } catch (error) {
      console.error('[Finalizzazione] Errore durante la finalizzazione:', error);
      alert('Errore durante la finalizzazione del preventivo. Controlla la console per i dettagli.');
    } finally {
      setIsTranslating(false);
    }
  };

  const getQuoteData = () => {
    // Se il preventivo è finalizzato, usa i dati finalizzati (già tradotti e puliti)
    // Altrimenti usa i dati correnti
    const itemsToUse = isFinalized ? finalizedItems : items;
    const notesToUse = isFinalized ? finalizedNotes : notes;
    const paymentDetailsToUse = isFinalized ? finalizedPaymentDetails : paymentDetails;
    
    // Calcola i totali con gli items finalizzati se necessario
    const finalSubtotal = isFinalized 
      ? finalizedItems.reduce((sum, item) => sum + item.total, 0)
      : subtotal;
    const finalDiscountAmount = (finalSubtotal * discount) / 100;
    const finalTotal = finalSubtotal - finalDiscountAmount;
    
    // REVISIONE FINALE: Rimuovi campi vuoti/nulli dal preventivo finale
    // Note: solo se hanno contenuto reale (non vuoto o solo spazi)
    const finalNotes = notesToUse && notesToUse.trim() ? notesToUse.trim() : undefined;
    
    // Payment method: solo se selezionato e non vuoto
    const finalPaymentMethod = paymentMethod && paymentMethod.trim() !== '' ? paymentMethod : undefined;
    
    // Payment details: solo se hanno contenuto reale E c'è un metodo di pagamento
    const finalPaymentDetails = finalPaymentMethod && paymentDetailsToUse && paymentDetailsToUse.trim() 
      ? paymentDetailsToUse.trim() 
      : undefined;
    
    // Customer info: solo se hanno contenuto reale
    const finalCustomerEmail = customerData.email && customerData.email.trim() ? customerData.email.trim() : undefined;
    const finalCustomerPhone = customerData.phone && customerData.phone.trim() ? customerData.phone.trim() : undefined;
    const finalCustomerAddress = customerData.address && customerData.address.trim() ? customerData.address.trim() : undefined;
    
    // Items: pulisci descrizioni vuote
    const cleanedItems = itemsToUse.map(item => ({
      ...item,
      description: item.description && item.description.trim() ? item.description.trim() : undefined,
      product_name: item.product_name && item.product_name.trim() ? item.product_name.trim() : item.product_name,
    }));
    
    return {
      quote_number: savedQuoteNumber || undefined,
      customer_name: customerData.name,
      customer_email: finalCustomerEmail,
      customer_phone: finalCustomerPhone,
      customer_address: finalCustomerAddress,
      language,
      items: cleanedItems,
      subtotal: finalSubtotal,
      discount_percentage: discount,
      discount_amount: finalDiscountAmount,
      total: finalTotal,
      notes: finalNotes,
      payment_method: finalPaymentMethod,
      payment_details: finalPaymentDetails,
      validity_days: validityDays,
      created_at: new Date().toISOString(),
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Nuovo Preventivo</h2>

      {/* Language Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium mb-2">🌐 Lingua</label>
        <div className="flex gap-2 flex-wrap">
          {(['it', 'en', 'es', 'fr', 'pt', 'cn', 'rs'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              disabled={isTranslating}
              className={`px-4 py-2 rounded-lg transition ${
                language === lang
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {lang.toUpperCase()}
              {isTranslating && language === lang && ' ⏳'}
            </button>
          ))}
        </div>
        {isTranslating && (
          <p className="text-sm text-gray-600 mt-2">Traduzione in corso...</p>
        )}
      </div>

      {/* Customer Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-semibold mb-4">👤 Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefono</label>
            <input
              type="tel"
              value={customerData.phone}
              onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Indirizzo</label>
            <input
              type="text"
              value={customerData.address}
              onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium mb-2">📦 Seleziona Pacchetto (opzionale)</label>
        <select
          value={selectedPackage}
          onChange={(e) => {
            setSelectedPackage(e.target.value);
            // La logica di rimozione/aggiunta prodotti è gestita nel useEffect
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Nessuno</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - €{pkg.total_price.toFixed(2)}
            </option>
          ))}
        </select>
        {selectedPackage && (
          <p className="text-sm text-gray-600 mt-2">
            ✓ Pacchetto selezionato: i prodotti verranno inseriti automaticamente nel preventivo
          </p>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">📋 Prodotti</h3>
          <button
            onClick={handleAddItem}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            + Aggiungi Prodotto
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <select
                value={item.product_id || ''}
                onChange={async (e) => {
                  const product = products.find(p => p.id === e.target.value);
                  if (product) {
                    setIsTranslating(true);
                    try {
                      const translatedName = await getTranslatedProductName(product, language);
                      const translatedDescription = await getTranslatedProductDescription(product, language);
                      
                      // Aggiorna tutti i campi in una sola operazione
                      const newItems = [...items];
                      newItems[index] = {
                        ...newItems[index],
                        product_id: product.id,
                        product_name: translatedName,
                        description: translatedDescription,
                        unit_price: product.base_price,
                        total: product.base_price * newItems[index].quantity,
                      };
                      setItems(newItems);
                    } catch (error) {
                      console.error('Errore traduzione:', error);
                      // Fallback: prova comunque a tradurre se la lingua non è italiana
                      let fallbackName = product.name;
                      let fallbackDescription = product.description || undefined;
                      if (language !== 'it') {
                        try {
                          fallbackName = await translateText(product.name, language, 'it');
                          if (product.description) {
                            fallbackDescription = await translateText(product.description, language, 'it');
                          }
                        } catch (translationError) {
                          console.error('Errore traduzione fallback:', translationError);
                        }
                      }
                      const newItems = [...items];
                      newItems[index] = {
                        ...newItems[index],
                        product_id: product.id,
                        product_name: fallbackName,
                        description: fallbackDescription,
                        unit_price: product.base_price,
                        total: product.base_price * newItems[index].quantity,
                      };
                      setItems(newItems);
                    } finally {
                      setIsTranslating(false);
                    }
                  } else if (e.target.value === '') {
                    // Se deseleziona il prodotto, resetta l'item
                    const newItems = [...items];
                    newItems[index] = {
                      product_name: '',
                      quantity: 1,
                      unit_price: 0,
                      total: 0,
                    };
                    setItems(newItems);
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
              >
                <option value="">Seleziona prodotto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - €{p.base_price.toFixed(2)}/{p.unit}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border rounded-lg"
                placeholder="Qtà"
              />
              <input
                type="number"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 border rounded-lg"
                placeholder="Prezzo"
              />
              <span className="w-24 text-right">€{item.total.toFixed(2)}</span>
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-semibold mb-4">💰 Riepilogo</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotale:</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Sconto:</span>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border rounded"
              />
              <span>%</span>
              <span className="w-24 text-right">-€{discountAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>TOTALE:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-semibold mb-4">💳 Metodo di Pagamento</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo di Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'iban' | 'banca' | 'bonifico' | 'altro' | '')}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Seleziona metodo...</option>
              <option value="iban">IBAN</option>
              <option value="banca">Banca</option>
              <option value="bonifico">Bonifico</option>
              <option value="altro">Altro</option>
            </select>
          </div>
          {paymentMethod && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {paymentMethod === 'iban' && 'IBAN'}
                {paymentMethod === 'banca' && 'Dettagli Banca'}
                {paymentMethod === 'bonifico' && 'Dettagli Bonifico'}
                {paymentMethod === 'altro' && 'Dettagli Pagamento'}
              </label>
              <textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder={
                  paymentMethod === 'iban' ? 'IT60 X054 2811 1010 0000 0123 456'
                  : paymentMethod === 'banca' ? 'Nome banca, filiale, coordinate...'
                  : paymentMethod === 'bonifico' ? 'Coordinate bancarie, beneficiario...'
                  : 'Inserisci i dettagli del metodo di pagamento'
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes & Validity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">📝 Note (opzionale)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">⏰ Validità</label>
            <input
              type="number"
              min="1"
              value={validityDays}
              onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
              className="w-32 px-3 py-2 border rounded-lg"
            />
            <span className="ml-2 text-sm text-gray-500">giorni</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveDraft}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          💾 Salva Bozza
        </button>
        <button
          onClick={handleFinalizeQuote}
          disabled={isTranslating || isFinalized}
          className={`px-6 py-2 rounded-lg transition ${
            isFinalized 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : isTranslating
              ? 'bg-yellow-600 text-white cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {isTranslating ? '⏳ Finalizzazione in corso...' : isFinalized ? '✅ Preventivo Finalizzato' : '✨ Finalizza Preventivo'}
        </button>
        <button
          onClick={() => setShowPreview(true)}
          disabled={!isFinalized}
          className={`px-6 py-2 rounded-lg transition ${
            isFinalized
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          👁️ Anteprima
        </button>
        <button
          onClick={handleExportPDF}
          disabled={!isFinalized || isExporting}
          className={`px-6 py-2 rounded-lg transition ${
            isFinalized && !isExporting
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {isExporting ? '⏳...' : '📄 Esporta PDF'}
        </button>
        <button
          onClick={handleExportImage}
          disabled={!isFinalized || isExporting}
          className={`px-6 py-2 rounded-lg transition ${
            isFinalized && !isExporting
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {isExporting ? '⏳...' : '🖼️ Esporta Immagine'}
        </button>
      </div>
      {!isFinalized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Attenzione:</strong> Devi finalizzare il preventivo prima di visualizzare l'anteprima o esportare. 
            La finalizzazione tradurrà tutti i contenuti nella lingua selezionata.
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold">Anteprima Preventivo</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-x-auto" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '100%' }}>
                <QuoteTemplate quote={getQuoteData()} showPreview={true} />
              </div>
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Chiudi
              </button>
              <button
                onClick={async () => {
                  // Esporta mentre l'anteprima è ancora visibile
                  await handleExportPDF();
                  setShowPreview(false);
                }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                📄 Esporta PDF
              </button>
              <button
                onClick={async () => {
                  // Esporta mentre l'anteprima è ancora visibile
                  await handleExportImage();
                  setShowPreview(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                🖼️ Esporta Immagine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEZIONE 4: STORICO PREVENTIVI
// ═══════════════════════════════════════════════════════════════════════════

function StoricoPreventivi({ onEdit }: { onEdit: (quoteId: string) => void }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [translatedQuoteData, setTranslatedQuoteData] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<QuoteProduct[]>([]);

  useEffect(() => {
    fetchQuotes();
    fetchProducts();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/preventivi/quotes');
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/preventivi/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: '📝 Bozza',
      sent: '⏳ Inviato',
      accepted: '✅ Accettato',
      rejected: '❌ Rifiutato',
      expired: '⏰ Scaduto',
    };
    return badges[status as keyof typeof badges] || status;
  };

  const handleView = async (quote: Quote) => {
    setSelectedQuote(quote);
    setIsTranslating(true);
    
    // Assicurati che i prodotti siano caricati
    if (products.length === 0) {
      await fetchProducts();
    }
    
    // Traduci gli items se hanno product_id
    let translatedItems: QuoteItem[] = [];
    
    if (Array.isArray(quote.items) && quote.items.length > 0) {
      // Attendi che i prodotti siano disponibili
      let currentProducts = products;
      if (currentProducts.length === 0) {
        try {
          const res = await fetch('/api/preventivi/products');
          const data = await res.json();
          currentProducts = Array.isArray(data) ? data : [];
          setProducts(currentProducts);
        } catch (error) {
          console.error('Errore caricamento prodotti:', error);
        }
      }
      
      if (currentProducts.length > 0) {
        const itemsPromises = (quote.items as QuoteItem[]).map(async (item) => {
          // Se l'item ha un product_id, traduci nome e descrizione dalla lingua originale italiana
          if (item.product_id) {
            const product = currentProducts.find(p => p.id === item.product_id);
            if (product) {
              try {
                // Traduci sempre dalla lingua originale italiana alla lingua del preventivo
                let translatedName = product.name;
                let translatedDescription = product.description || undefined;
                
                if (quote.language !== 'it') {
                  if (product.name) {
                    translatedName = await translateText(product.name, quote.language, 'it');
                  }
                  if (product.description) {
                    translatedDescription = await translateText(product.description, quote.language, 'it');
                  }
                }
                
                return {
                  ...item,
                  product_name: translatedName,
                  description: translatedDescription,
                };
              } catch (error) {
                console.error('Errore traduzione item:', error);
                // Fallback: prova comunque a tradurre se la lingua non è italiana
                let fallbackName = product.name;
                let fallbackDescription = product.description || undefined;
                if (quote.language !== 'it') {
                  try {
                    fallbackName = await translateText(product.name, quote.language, 'it');
                    if (product.description) {
                      fallbackDescription = await translateText(product.description, quote.language, 'it');
                    }
                  } catch (translationError) {
                    console.error('Errore traduzione fallback:', translationError);
                  }
                }
                return {
                  ...item,
                  product_name: fallbackName,
                  description: fallbackDescription,
                };
              }
            }
          }
          // Se non ha product_id, usa i valori salvati
          return item;
        });
        
        translatedItems = await Promise.all(itemsPromises);
      } else {
        // Se non ci sono prodotti disponibili, usa i valori salvati
        translatedItems = Array.isArray(quote.items) ? quote.items as QuoteItem[] : [];
      }
    } else {
      translatedItems = Array.isArray(quote.items) ? quote.items as QuoteItem[] : [];
    }
    
    setTranslatedQuoteData({
      quote_number: quote.quote_number,
      customer_name: quote.customer_name,
      customer_email: quote.customer_email || undefined,
      customer_phone: quote.customer_phone || undefined,
      customer_address: quote.customer_address || undefined,
      language: quote.language,
      items: translatedItems,
      subtotal: quote.subtotal,
      discount_percentage: quote.discount_percentage,
      discount_amount: quote.discount_amount,
      total: quote.total,
      notes: quote.notes || undefined,
      payment_method: quote.payment_method || undefined,
      payment_details: quote.payment_details || undefined,
      validity_days: quote.validity_days,
      created_at: quote.created_at,
    });
    
    setIsTranslating(false);
    setShowPreview(true);
  };

  const handleDuplicate = async (quote: Quote) => {
    try {
      const response = await fetch('/api/preventivi/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          customer_phone: quote.customer_phone,
          customer_address: quote.customer_address,
          language: quote.language,
          items: Array.isArray(quote.items) ? quote.items : [],
          subtotal: quote.subtotal,
          discount_percentage: quote.discount_percentage,
          discount_amount: quote.discount_amount,
          total: quote.total,
          notes: quote.notes,
          validity_days: quote.validity_days,
          status: 'draft',
        }),
      });
      if (response.ok) {
        alert('Preventivo duplicato con successo!');
        fetchQuotes();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nella duplicazione');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo preventivo?')) return;
    try {
      await fetch(`/api/preventivi/quotes?id=${id}`, { method: 'DELETE' });
      fetchQuotes();
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nell\'eliminazione');
    }
  };

  const handleExportPDF = async (quote: Quote) => {
    setIsExporting(true);
    try {
      await handleView(quote);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aspetta la traduzione
      const filename = generateQuoteFilename(quote.quote_number, 'pdf');
      await exportQuoteAsPDF('quote-template', filename);
      setShowPreview(false);
    } catch (error) {
      console.error('Errore export PDF:', error);
      alert('Errore durante l\'export PDF');
      setShowPreview(false);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async (quote: Quote) => {
    setIsExporting(true);
    try {
      await handleView(quote);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aspetta la traduzione
      const filename = generateQuoteFilename(quote.quote_number, 'png');
      await exportQuoteAsImage('quote-template', filename);
      setShowPreview(false);
    } catch (error) {
      console.error('Errore export immagine:', error);
      alert('Errore durante l\'export immagine');
      setShowPreview(false);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Storico Preventivi</h2>
        <input
          type="text"
          placeholder="🔍 Cerca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Caricamento...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Preventivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Totale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Nessun preventivo trovato per la ricerca' : 'Nessun preventivo trovato'}
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.quote_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{quote.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleView(quote)}
                        className="text-emerald-600 hover:text-emerald-700 mr-2"
                      >
                        Visualizza
                      </button>
                      <button
                        onClick={() => onEdit(quote.id)}
                        className="text-purple-600 hover:text-purple-700 mr-2"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDuplicate(quote)}
                        className="text-blue-600 hover:text-blue-700 mr-2"
                      >
                        Duplica
                      </button>
                      <button
                        onClick={() => handleExportPDF(quote)}
                        disabled={isExporting}
                        className="text-gray-600 hover:text-gray-700 mr-2 disabled:opacity-50"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleExportImage(quote)}
                        disabled={isExporting}
                        className="text-gray-600 hover:text-gray-700 mr-2 disabled:opacity-50"
                      >
                        Immagine
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold">Anteprima Preventivo - {selectedQuote.quote_number}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-x-auto" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '100%' }}>
                {isTranslating ? (
                  <div className="p-8 text-center">
                    <p>Traduzione in corso...</p>
                  </div>
                ) : translatedQuoteData ? (
                  <QuoteTemplate quote={translatedQuoteData} showPreview={true} />
                ) : selectedQuote ? (
                  <QuoteTemplate quote={{
                    quote_number: selectedQuote.quote_number,
                    customer_name: selectedQuote.customer_name,
                    customer_email: selectedQuote.customer_email || undefined,
                    customer_phone: selectedQuote.customer_phone || undefined,
                    customer_address: selectedQuote.customer_address || undefined,
                    language: selectedQuote.language,
                    items: Array.isArray(selectedQuote.items) ? selectedQuote.items as QuoteItem[] : [],
                    subtotal: selectedQuote.subtotal,
                    discount_percentage: selectedQuote.discount_percentage,
                    discount_amount: selectedQuote.discount_amount,
                    total: selectedQuote.total,
                    notes: selectedQuote.notes || undefined,
                    payment_method: selectedQuote.payment_method || undefined,
                    payment_details: selectedQuote.payment_details || undefined,
                    validity_days: selectedQuote.validity_days,
                    created_at: selectedQuote.created_at,
                  }} showPreview={true} />
                ) : null}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-4 justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Chiudi
              </button>
              <button
                onClick={async () => {
                  // Esporta mentre l'anteprima è ancora visibile
                  await handleExportPDF(selectedQuote);
                  setShowPreview(false);
                }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                📄 Esporta PDF
              </button>
              <button
                onClick={async () => {
                  // Esporta mentre l'anteprima è ancora visibile
                  await handleExportImage(selectedQuote);
                  setShowPreview(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                🖼️ Esporta Immagine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
