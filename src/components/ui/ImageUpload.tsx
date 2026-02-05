'use client';

import { useState, useRef, DragEvent } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label = 'Immagine', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Per favore seleziona un file immagine');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('L\'immagine deve essere inferiore a 5MB');
      return;
    }

    setUploading(true);
    
    // Preview locale
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore durante il caricamento');
      }

      const data = await response.json();
      onChange(data.url);
      setPreview(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Errore durante il caricamento dell\'immagine');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {/* URL Input (alternativa) */}
      <div className="mb-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value || null);
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Oppure incolla un URL immagine..."
        />
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
            <p className="text-sm text-gray-600">Caricamento in corso...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => {
                  // Se l'immagine non si carica, mostra solo il placeholder
                  setPreview(null);
                }}
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Cambia Immagine
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Rimuovi
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-purple-600 font-medium">Clicca per caricare</span> o trascina un'immagine qui
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP fino a 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
