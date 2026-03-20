'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SdsDocument {
  id: string;
  product_id: string;
  document_type?: 'sds' | 'certificate_of_origin';
  label: string;
  file_url: string;
  file_name: string | null;
  display_order: number;
}

interface ProductWithSds {
  id: string;
  name: string;
  category: string | null;
  short_description: string | null;
  sds_documents: SdsDocument[];
}

function ProductDocumentsList({
  documents,
  accent,
}: {
  documents: SdsDocument[];
  accent?: boolean;
}) {
  const sdsDocs = documents.filter((d) => (d.document_type || 'sds') === 'sds');
  const certDocs = documents.filter((d) => d.document_type === 'certificate_of_origin');
  const baseClass = accent
    ? 'inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm'
    : 'inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm';
  const certClass = accent
    ? 'inline-flex items-center gap-2 px-4 py-2.5 bg-amber-200/80 text-amber-900 rounded-lg hover:opacity-90 transition-colors font-medium text-sm'
    : 'inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm';

  const DocLink = ({ doc, className }: { doc: SdsDocument; className: string }) => (
    <a
      href={doc.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {doc.label}
    </a>
  );

  return (
    <div className="flex flex-wrap gap-3">
      {sdsDocs.map((doc) => (
        <DocLink key={doc.id} doc={doc} className={baseClass} />
      ))}
      {certDocs.map((doc) => (
        <DocLink key={doc.id} doc={doc} className={certClass} />
      ))}
    </div>
  );
}

export default function SDSPageClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [products, setProducts] = useState<ProductWithSds[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/sds');
        if (!res.ok) throw new Error('Errore caricamento');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const productsWithDocs = products.filter((p) => p.sds_documents?.length > 0);
  const highlightedProduct = productId
    ? productsWithDocs.find((p) => p.id === productId)
    : null;

  useEffect(() => {
    if (productId && highlightedProduct) {
      document.getElementById(`product-${productId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [productId, highlightedProduct]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
        <h1 className="font-heading font-semibold text-2xl md:text-3xl text-[var(--color-primary)] mb-2">
          Schede di sicurezza e certificati
        </h1>
        <p className="text-gray-600 mb-8">
          Schede di sicurezza (SDS) e certificati di origine dei prodotti LEM Solutions. Seleziona il prodotto per scaricare i documenti.
        </p>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Caricamento...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">{error}</div>
        ) : productsWithDocs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 mb-6">
              Le Safety Data Sheet sono disponibili su richiesta per tutti i nostri prodotti.
            </p>
            <Link
              href="/#support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              Contattaci per richiedere la SDS
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {highlightedProduct && (
              <div
                id={`product-${highlightedProduct.id}`}
                className="border-2 border-[var(--color-accent)] rounded-xl p-6 bg-blue-50/30"
              >
                <span className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wide">
                  Prodotto selezionato
                </span>
                <h2 className="font-heading font-semibold text-lg text-gray-900 mt-1">
                  {highlightedProduct.name}
                </h2>
                {highlightedProduct.category && (
                  <p className="text-sm text-gray-500 mb-4">{highlightedProduct.category}</p>
                )}
                <ProductDocumentsList documents={highlightedProduct.sds_documents} accent />
              </div>
            )}
            {productsWithDocs
              .filter((p) => !productId || p.id !== productId)
              .map((product) => (
              <div
                key={product.id}
                id={`product-${product.id}`}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
              >
                <h2 className="font-heading font-semibold text-lg text-gray-900 mb-1">
                  {product.name}
                </h2>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                )}
                <ProductDocumentsList documents={product.sds_documents} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-[var(--color-accent)] hover:underline font-medium">
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
