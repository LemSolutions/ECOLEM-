'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DocumentFile {
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore caricamento');
      }
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore caricamento');
      }

      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Eliminare questo file?')) return;
    try {
      const res = await fetch(`/api/documents?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Errore eliminazione');
      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    }
  };

  const copyUrl = (url: string, path: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return '🖼️';
    return '📁';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Archivio Documenti</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Upload area */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Carica documenti</h2>
            <p className="text-sm text-gray-500 mb-4">
              PDF, DOC, DOCX, JPG, PNG, WEBP — max 10MB. Usa l&apos;URL generato per SDS, certificati, ecc.
            </p>
            <label
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition
                ${uploading ? 'bg-gray-300 text-gray-500 cursor-wait' : 'bg-[var(--color-primary)] text-white hover:opacity-90'}
              `}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Caricamento...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Scegli file da caricare
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* File list */}
          <div className="p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-4">File caricati</h2>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Caricamento...</div>
            ) : files.length === 0 ? (
              <div className="py-12 text-center text-gray-500 rounded-lg border-2 border-dashed border-gray-200">
                <p className="mb-2">Nessun documento caricato</p>
                <p className="text-sm">Carica un file per ottenere un URL da usare nelle SDS e certificati</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-2xl flex-shrink-0">{getFileIcon(file.name)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatSize(file.size)} • {file.created_at ? new Date(file.created_at).toLocaleDateString('it-IT') : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => copyUrl(file.url, file.path)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                      >
                        {copiedPath === file.path ? '✓ Copiato' : 'Copia URL'}
                      </button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                      >
                        Apri
                      </a>
                      <button
                        onClick={() => handleDelete(file.path)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <strong>Come usare:</strong> Dopo aver caricato un file, clicca &quot;Copia URL&quot; e incolla l&apos;URL nel form SDS/Certificati quando aggiungi un documento a un prodotto.
        </div>
      </main>
    </div>
  );
}
